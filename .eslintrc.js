module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  // required to lint *.vue files
  plugins: ['chai-expect', 'chai-friendly'],
  // add your custom rules here
  rules: {
    semi: ['error', 'never'],
    'no-console': ['error', { allow: ['warn', 'error'] }]
  },
  globals: {
    expect: true
  }
}
