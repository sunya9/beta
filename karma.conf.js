const webpack = require('./webpack.config')

module.exports = config => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      { pattern: 'test/components/*.js', watched: false }
    ],
    preprocessors: {
      'test/components/*.js': ['webpack']
    },
    webpack,
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },
    browsers: ['Chrome'],
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
