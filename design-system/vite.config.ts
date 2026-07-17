import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server + gallery build. `npm run dev` opens the component gallery;
// `npm run gallery` builds it to dist-gallery/ for a static preview.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-gallery',
  },
});
