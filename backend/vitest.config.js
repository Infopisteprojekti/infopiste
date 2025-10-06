import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'tests/', 'utils/**', 'mockdata/**'],
      include: ['app.js', 'services/**', 'controllers/**'],
    },
  },
});
