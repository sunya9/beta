module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    mocha: true
  },
  extends: ['eslint:recommended', 'plugin:vue/essential', 'prettier'],
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  // required to lint *.vue files
  plugins: ['chai-expect', 'chai-friendly'],
  // add your custom rules here
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error']
      }
    ]
  },
  globals: {
    expect: true
  }
}
