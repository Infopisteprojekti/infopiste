const  globals = require('globals')

module.exports = [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
    rules: {
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
      'no-unused-vars': 0,
    },
    ignores: ['node_modules', 'uploads', 'eslint.config.cjs'],
  },
]
