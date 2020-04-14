module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    jest: true,
    'cypress/globals': true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'eslint:recommended',
    'plugin:cypress/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  plugins: ['jest', 'cypress'],
  // add your custom rules here
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error'],
      },
    ],
    'no-trailing-spaces': 'error',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    camelcase: 'off',
    // '@typescript-eslint/camelcase': 'off',
    // '@typescript-eslint/explicit-function-return-type': 'off',
    eqeqeq: 'error',
    // 'prefer-template': 'error',
    // https://teppeis.hatenablog.com/entry/2019/02/typescript-eslint
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'vue/max-attributes-per-line': 'off',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'error',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'unicorn/number-literal-case': 'off',
  },
}
