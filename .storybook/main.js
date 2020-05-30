const path = require('path')
const merge = require('webpack-merge')

const srcDir = '../src'
const rootDir = '../'

module.exports = {
  stories: ['../src/**/*.stories.ts'],
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-actions/register',
    '@storybook/addon-backgrounds/register',
    '@storybook/theming',
  ],
  webpackFinal: (storybookBaseConfig) => {
    return merge(storybookBaseConfig, webpackConfig)
  },
}

const webpackConfig = {
  resolve: {
    alias: {
      '~~': path.resolve(__dirname, rootDir),
      '~': path.resolve(__dirname, srcDir),
    },
    extensions: ['.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.(otf|eot|ttf|woff|woff2)(\?.+)?$/,
        loader: 'url-loader',
      },
      // {
      //   test: /\.svg$/,
      //   loader: 'file-loader',
      // },
      {
        test: /\.(sass|scss)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.vue$/,
        loader: 'vue-docgen-loader',
        enforce: 'post',
      },
      {
        test: /\.vue$/,
        use: 'vue-docgen-loader',
        enforce: 'post',
      },
    ],
  },
}
