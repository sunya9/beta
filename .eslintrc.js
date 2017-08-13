module.exports = {
  root: true,
  // parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'vue',
    'chai-expect',
    'chai-friendly'
  ],
  // add your custom rules here
  rules: {
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2
  },
  globals: {}
}
