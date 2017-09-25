const webpack = require('./webpack.config')
process.env.CHROME_BIN = require('puppeteer').executablePath()

module.exports = config => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: ['test/components/*.js'],
    preprocessors: {
      'test/components/*.js': 'webpack',
      'test/client-helpers.js': 'webpack'
    },
    webpack,
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },
    browsers: ['ChromeHeadless'],
    reporters: ['mocha'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    }
  })
  if (process.env.TRAVIS) {
    config.browsers = ['Chrome_travis_ci']
  }
}
