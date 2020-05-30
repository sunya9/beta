import * as fs from 'fs'
import { Configuration } from '@nuxt/types'
import { EnvironmentPlugin } from 'webpack'
import dotenv from 'dotenv'
import pkg from './package.json'

dotenv.config()

const { homepage: npm_package_homepage } = pkg
const lastModified = fs.statSync('./package.json').mtime

const config: Configuration = {
  buildModules: ['@nuxt/typescript-build', 'nuxt-typed-vuex'],
  srcDir: 'src/',
  mode: 'spa',
  head: {
    titleTemplate(partial) {
      return partial ? `${partial} - Beta` : 'Beta'
    },
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Beta is a client for pnut.io.',
      },
      {
        httpEquiv: 'Pragma',
        content: 'no-cache',
      },
      {
        httpEquiv: 'Cache-Control',
        content: 'no-cache',
      },
      // pwa-module does not support og:site_Name
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'Beta',
      },
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400',
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico',
      },
    ],
  },
  /*
   ** Global CSS
   */
  css: [
    '~assets/css/main.scss',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#d36854',
  },

  // webpack build setttings
  build: {
    extend(config) {
      if (
        !config.resolve ||
        !config.resolve.alias ||
        !config.module ||
        !config.output
      )
        return
      config.resolve.alias['bootstrap.native$'] =
        'bootstrap.native/dist/bootstrap-native-v4.js'
      config.module.rules.unshift({
        test: /\.worker\.(js|ts)$/,
        loader: 'worker-loader',
      })
      config.output.globalObject = 'this'
    },
    extractCSS: true,
    plugins: [new EnvironmentPlugin(['npm_package_version'])],
    loaders: {
      vue: {
        compilerOptions: {
          whitespace: 'condense',
        },
      },
    },
    transpile: [/typed-vuex/],
  },

  // plugin settings
  plugins: [
    '~/plugins/di',
    '~/plugins/bootstrap.client',
    '~/plugins/vue-infinite',
    '~/plugins/mousetrap',
    '~/plugins/vue-outside',
    '~/plugins/emoji',
    '~/plugins/emojify',
    '~/plugins/vue-scrollto',
    '~/plugins/axios/',
    '~/plugins/font-awesome',
    '~/plugins/modal',
    '~/plugins/dayjs',
  ],

  // router settings
  router: {
    linkActiveClass: 'active',
  },
  cache: true,
  env: {
    npm_package_homepage: npm_package_homepage.toString(),
    last_modified: lastModified.toString(),
  },
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/component-cache',
    '@nuxtjs/toast',
    '@nuxtjs/google-analytics',
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    [
      '@nuxtjs/router',
      {
        keepDefaultRouter: true,
      },
    ],
  ],
  'google-analytics': {
    id: 'UA-10104011-16',
  },
  toast: {
    position: 'bottom-left',
    duration: 5000,
  },
  workbox: {
    dev: process.env.NODE_ENV !== 'production',
    runtimeCaching: [
      {
        urlPattern: 'https://twemoji.maxcdn.com/*',
        handler: 'cacheFirst',
        method: 'GET',
      },
      {
        urlPattern: 'https://.*.cloudfront.net/*',
        handler: 'cacheFirst',
        method: 'GET',
      },
    ],
  },
  manifest: {
    name: 'Beta',
  },
  icon: {
    iconSrc: 'static/img/beta.png',
  },
  meta: {
    theme_color: '#d36854',
  },
  axios: {
    baseURL: 'https://api.pnut.io/v0',
  },
  auth: {
    strategies: {
      pnut: {
        _scheme: 'oauth2',
        authorization_endpoint: 'https://pnut.io/oauth/authenticate',
        token_endpoint: 'https://api.pnut.io/v0/oauth/access_token',
        userinfo_endpoint: 'https://api.pnut.io/v0/token',
        scope: [
          'stream',
          'messages:io.pnut.core.pm',
          'messages:io.pnut.core.chat',
          'write_post',
          'follow',
          'update_profile',
          'files',
          'polls',
        ],
        client_id: process.env.CLIENT_ID,
      },
      local: false,
    },
    redirect: {
      callback: '/callback',
      login: '/',
    },
  },
  render: {
    http2: {
      push: true,
    },
  },
  typescript: {
    ignoreNotFoundWarnings: true,
  },
}

export default config
