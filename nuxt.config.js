require('dotenv').config()

const { ProvidePlugin, EnvironmentPlugin } = require('webpack')
const { homepage: npm_package_homepage } = require('./package')
const fs = require('fs')
const lastModified = fs.statSync('./package.json').mtime

module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'Beta',
    titleTemplate: partial => (partial ? `${partial} - Beta` : 'Beta'),
    meta: [
      {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Beta is a client for pnut.io.'
      },
      {
        'http-equiv': 'Pragma',
        content: 'no-cache'
      },
      {
        'http-equiv': 'Cache-Control',
        content: 'no-cache'
      },
      // pwa-module does not support og:site_Name
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'Beta'
      }
    ],
    link: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Montserrat:300,400'
      },
      {
        rel: 'shortcut icon',
        href: '/favicon.ico'
      }
    ]
  },
  /*
   ** Global CSS
   */
  css: [
    {
      src: '~assets/css/main.scss',
      lang: 'scss'
    },
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#d36854'
  },

  // webpack build setttings
  build: {
    extractCSS: true,
    plugins: [
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default'],
        Util: 'exports-loader?Util!bootstrap/js/dist/util',
        Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown'
      }),
      new EnvironmentPlugin(['npm_package_version'])
    ],
    vendor: [
      'mousetrap',
      'jquery',
      'tether',
      'vue-infinite-scroll',
      'vue-on-click-outside',
      '~/plugins/bootstrap.js',
      '~/plugins/mousetrap.js',
      '~/plugins/vue-infinite.js',
      '~/plugins/emoji.js',
      'moment',
      '~/components/Post.vue',
      '~/components/List.vue',
      '~/plugins/font-awesome'
    ]
  },

  // plugin settings
  plugins: [
    {
      src: '~/plugins/bootstrap',
      ssr: false
    },
    {
      src: '~/plugins/vue-infinite',
      ssr: false
    },
    {
      src: '~/plugins/mousetrap',
      ssr: false
    },
    {
      src: '~/plugins/vue-outside',
      ssr: false
    },
    {
      src: '~/plugins/emoji',
      ssr: false
    },
    {
      src: '~/plugins/vue-emojify',
      ssr: false
    },
    {
      src: '~/plugins/vue-scrollto',
      ssr: false
    },
    '~/plugins/axios/',
    '~/plugins/font-awesome'
  ],

  // router settings
  router: {
    extendRoutes(routes, resolve) {
      // Replace "at" prefix with @ because cannot use @ for file/dir name in nuxt's project.
      routes.forEach(route => {
        if (route.name && route.name.startsWith('atname')) {
          route.name = route.name.replace(/^atname/, '@name')
          route.path = route.path.replace(/^\/at/, '/@')
        }
      })
      routes.push({
        name: '@name-posts-id',
        path: '/@:name/posts/:id?',
        component: resolve(__dirname, 'pages/posts/_id.vue')
      })
    },
    scrollBehavior(to, from, savedPosition) {
      // default + alpha
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        if (to.matched.length < 2) {
          position = {
            x: 0,
            y: 0
          }
        } else if (
          to.matched.some(r => r.components.default.options.scrollToTop)
        ) {
          position = {
            x: 0,
            y: 0
          }
        }
        if (to.hash) {
          position = {
            selector: to.hash
          }
        }

        // go to post page first time
        if (to.params.id) {
          const el = document.querySelector(`#post-${to.params.id}`)
          if (el) {
            position = {
              x: 0,
              y: window.pageYOffset + el.getBoundingClientRect().top - 100
            }
          }
        }
        return position
      }
    },
    linkActiveClass: 'active'
  },
  cache: true,
  env: {
    npm_package_homepage,
    last_modified: lastModified
  },
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/component-cache',
    '@nuxtjs/toast',
    '@nuxtjs/google-analytics',
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  'google-analytics': {
    id: 'UA-10104011-16'
  },
  toast: {
    position: 'bottom-left',
    duration: 5000
  },
  workbox: {
    dev: process.env.NODE_ENV !== 'production',
    runtimeCaching: [
      {
        urlPattern: 'https://twemoji.maxcdn.com/*',
        handler: 'cacheFirst',
        method: 'GET'
      },
      {
        urlPattern: 'https://.*.cloudfront.net/*',
        handler: 'cacheFirst',
        method: 'GET'
      }
    ]
  },
  manifest: {
    name: 'Beta'
  },
  icon: {
    iconSrc: 'static/img/beta.png'
  },
  meta: {
    theme_color: '#d36854'
  },
  axios: {
    baseURL: 'https://api.pnut.io/v0'
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
          'polls'
        ],
        client_id: process.env.CLIENT_ID
      }
    },
    redirect: {
      callback: '/callback',
      login: '/'
    }
  },
  render: {
    http2: {
      push: true
    }
  }
}
