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
    titleTemplate: '%s - Beta',
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
        content: 'beta is a client for pnut.io.'
      },
      {
        'http-equiv': 'Pragma',
        content: 'no-cache'
      },
      {
        'http-equiv': 'Cache-Control',
        content: 'no-cache'
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
    }
  ],
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#d36854'
  },

  // webpack build setttings
  build: {
    extend(config, { isDev, isClient }) {
      if (!isDev) {
        if (isClient) {
          config.plugins = config.plugins.filter(
            plugin => plugin.constructor.name !== 'UglifyJsPlugin'
          )
        }
      }
    },
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
      'axios',
      'vue-infinite-scroll',
      'vue-on-click-outside',
      '~/plugins/bootstrap.js',
      '~/plugins/api.js',
      '~/plugins/mousetrap.js',
      '~/plugins/vue-infinite.js',
      '~/plugins/emoji.js',
      'moment',
      'cheerio',
      '~/components/Post.vue',
      '~/components/List.vue'
    ]
  },

  // plugin settings
  plugins: [
    {
      src: '~/plugins/bootstrap',
      ssr: false
    },
    '~/plugins/api',
    {
      src: '~/plugins/vue-infinite',
      ssr: false
    },
    {
      src: '~/plugins/mousetrap',
      ssr: false
    },
    {
      src: '~/plugins/ga',
      ssr: false
    },
    {
      src: '~/plugins/vue-outside',
      ssr: false
    },
    {
      src: '~/plugins/emoji',
      ssr: false
    }
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
  }
}
