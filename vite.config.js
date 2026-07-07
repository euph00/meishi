import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import { renderContent, renderPostPages, CONTENT_FILE } from './scripts/render-content.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const POST_TEMPLATE = path.join(ROOT, 'post.html');

// Injects content/site.json into index.html's placeholders and generates one
// static page per blog post (posts/<slug>.html) from the post.html template.
// Dev renders posts on the fly and reloads when content or templates change;
// build writes them to gitignored posts/*.html so Rollup can bundle them.
export default defineConfig({
  appType: 'mpa',
  plugins: [
    {
      name: 'euph-content',
      config(_config, { command }) {
        if (command !== 'build') return;
        const input = { main: path.join(ROOT, 'index.html') };
        for (const page of renderPostPages()) {
          const abs = path.join(ROOT, page.fileName);
          fs.mkdirSync(path.dirname(abs), { recursive: true });
          fs.writeFileSync(abs, page.html);
          input[page.fileName.replace(/[^\w]+/g, '_')] = abs;
        }
        return { build: { rollupOptions: { input } } };
      },
      transformIndexHtml: {
        order: 'pre',
        handler(html, ctx) {
          return ctx.filename === path.join(ROOT, 'index.html') ? renderContent(html) : html;
        },
      },
      configureServer(server) {
        server.watcher.add([CONTENT_FILE, POST_TEMPLATE]);
        server.watcher.on('change', (file) => {
          if (file === CONTENT_FILE || file === POST_TEMPLATE) {
            server.ws.send({ type: 'full-reload' });
          }
        });
        server.middlewares.use(async (req, res, next) => {
          const match = req.url && req.url.match(/^\/(posts\/[a-z0-9-]+\.html)(?:\?.*)?$/);
          if (!match) return next();
          try {
            const page = renderPostPages().find((p) => p.fileName === match[1]);
            if (!page) return next();
            res.setHeader('Content-Type', 'text/html');
            res.end(await server.transformIndexHtml(req.url, page.html));
          } catch (err) {
            next(err);
          }
        });
      },
    },
  ],
});
