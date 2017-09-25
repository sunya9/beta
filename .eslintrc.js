module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: ['standard'],
  // required to lint *.vue files
  plugins: ['vue', 'chai-expect', 'chai-friendly'],
  // add your custom rules here
  rules: {
    'no-unused-expressions': 'off',
    'chai-friendly/no-unused-expressions': 'error',
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }
    ]
  },
  globals: {}
}
