import * as fs from 'fs'
import { NuxtConfig } from '@nuxt/types'
import { EnvironmentPlugin } from 'webpack'
import dotenv from 'dotenv'
import pkg from './package.json'

dotenv.config()

const { homepage: npm_package_homepage } = pkg
const lastModified = fs.statSync('./package.json').mtime

const config: NuxtConfig = {
  buildModules: [
    '@nuxtjs/pwa',
    '@nuxt/typescript-build',
    'nuxt-typed-vuex',
    '@nuxtjs/router-extras',
  ],
  srcDir: 'src/',
  ssr: false,
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
        'bootstrap.native/dist/bootstrap-native.esm.min.js'
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
    '~/plugins/mousetrap',
    '~/plugins/vue-outside',
    '~/plugins/emoji',
    '~/plugins/emojify',
    '~/plugins/vue-scrollto',
    '~/plugins/axios/',
    '~/plugins/font-awesome',
    '~/plugins/modal',
    '~/plugins/dayjs',
    // '~/plugins/created', disabled until support v1 api
    '~/plugins/intersection-observer.client',
    '~/plugins/composition-api',
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
    '@nuxtjs/component-cache',
    '@nuxtjs/toast',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'bootstrap-vue/nuxt',
    'nuxt-uid-module',
    '@nuxtjs/redirect-module',
  ],
  toast: {
    position: 'bottom-left',
    duration: 5000,
  },
  pwa: {
    icon: {
      fileName: 'img/beta.png',
    },
    meta: {
      theme_color: '#d36854',
    },
    manifest: {
      name: 'Beta',
    },
    workbox: {
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
  },
  axios: {
    baseURL: 'https://api.pnut.io/v0',
  },
  auth: {
    strategies: {
      pnut: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://pnut.io/oauth/authenticate',
          token: false,
          userInfo: 'https://api.pnut.io/v0/token',
        },
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
        clientId: process.env.CLIENT_ID,
      },
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
    typeCheck: false,
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
  },
  redirect: {
    rules: [{ from: '^/messages(.*)$', to: '/channels$1' }],
  },
  loadingIndicator: {
    name: 'circle',
    background: '#f9f9f9',
    color: '#d36854',
    color2: '#4a484c',
  },
  generate: {
    fallback: true,
  },
  storybook: {
    addons: ['@storybook/addon-knobs/register'],
  },
}

export default config
