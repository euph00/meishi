import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Library build: bundles the component barrel to dist/ as ESM + UMD (global
// `EuphUI`), with all component CSS extracted to a single dist/euph-ui.css.
// This is the artifact a consumer app — or the claude.ai/design converter —
// imports. React/ReactDOM stay external (peer deps).
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'EuphUI',
      fileName: 'euph-ui',
      formats: ['es', 'umd'],
    },
    cssFileName: 'euph-ui',
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
      },
    },
  },
});
