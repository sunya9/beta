const webpackConfig = require('./webpack.config')

module.exports = config => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      { pattern: 'test/components/*.js', watched: false },
      { pattern: 'test/page/*.js', watched: false }
    ],
    preprocessors: {
      'test/components/*.js': ['webpack']
      // 'test/page/*.js': ['webpack']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },
    browsers: ['Chrome'],
    cleint: {
      mocha: {
        require: [require.resolve('./test/helpers')]
      }
    },
    reporters: ['mocha']
  })
}
