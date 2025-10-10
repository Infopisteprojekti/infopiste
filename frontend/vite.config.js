import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/testSetup.js',
    exclude: [
      'e2e',
      'node_modules',
      'dist',
    ],
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
        'src/constants/**'
      ]
    }
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
