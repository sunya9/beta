const path = require('path')
const { merge } = require('webpack-merge')

const srcDir = path.resolve(__dirname, '../src')
const rootDir = path.resolve(__dirname, '../')

module.exports = {
  stories: ['../src/**/*.stories.ts'],
  addons: [
    'storycap/register',
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
      assets: path.resolve(srcDir, 'assets'),
      '~~': rootDir,
      '~': srcDir,
      'bootstrap.native$': 'bootstrap.native/dist/bootstrap-native-v4.js',
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
      {
        test: /\.(scss)$/,
        loaders: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: `sass-loader`,
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, '../')],
              },
            },
          },
          // {
          //   loader: 'sass-resources-loader',
          //   options: {
          //     resources: [path.resolve(__dirname, '../src/assets/css/adn_base_variables.scss')],
          //     include: path.resolve(__dirname, '../')
          //   }
          // }
        ],
      },
      // {
      //   test: /\.vue$/,
      //   use: 'vue-docgen-loader',
      //   enforce: 'post',
      // },
    ],
  },
}
