import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
    extends: [js.configs.recommended, prettier],
    rules: {
      eqeqeq: ['error', 'always'],
      'no-console': 0,
      'no-unused-vars': 0,
    },
  },
]);
