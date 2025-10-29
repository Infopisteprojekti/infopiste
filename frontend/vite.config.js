import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    include: ['react-pdf', 'pdfjs-dist'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup/testSetup.js',
    exclude: ['e2e', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      exclude: [
        'e2e/**',
        'playwright.config.js',
        'src/main.jsx',
        'node_modules/**',
        'dist/**',
        'eslint.config.js',
        'vite.config.js',
        'src/constants/**',
      ],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://backend:1234',
        changeOrigin: true,
      },
    },
  },
});
