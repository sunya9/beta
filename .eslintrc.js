module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'plugin:jest/recommended',
    'prettier'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },

  plugins: ['vue', 'jest'],
  // add your custom rules here
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ],
    'no-trailing-spaces': 'error',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true
      }
    ],
    eqeqeq: 'error',
    'prefer-template': 'error'
  }
}
