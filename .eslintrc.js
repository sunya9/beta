module.exports = {
  root: true,
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html',
    'vue',
    'chai-expect'
  ],
  // add your custom rules here
  rules: {},
  globals: {}
}
