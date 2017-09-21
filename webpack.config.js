// for karma
// from https://github.com/nuxt/nuxt.js/issues/200#issuecomment-308452393
const { resolve } = require('path')

module.exports = {
  resolve: {
    modules: [resolve(__dirname, 'lib'), 'node_modules'],
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '~': __dirname,
      'static': resolve(__dirname, 'static'),
      'assets': resolve(__dirname, 'assets')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        loader: 'vue-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        query: {
          limit: 1000,
          name: 'img/[name].[hash:7].[ext]'
        }
      }
    ]
  }
}
