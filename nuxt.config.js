const { ProvidePlugin } = require('webpack')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Beta',
    titleTemplate: '%s - Beta',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'beta is pnut.io client.' }

    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat' },
      { rel: 'shortcut icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [{
    src: '~assets/css/main.scss',
    lang: 'scss'
  }],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#d36854' },

  // webpack build setttings
  build: {
    extend (config) {
      config.plugins = config.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin')
    },
    plugins: [
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.Tether': 'tether',
        Tether: 'tether'
      })
    ],
    vendor: [
      'mousetrap',
      'jquery',
      'tether',
      'axios',
      'vue-infinite-scroll',
      '~plugins/bootstrap.js',
      '~plugins/api.js',
      '~plugins/vue-infinite.js',
      'moment',
      'cheerio',
      '~components/Post.vue',
      '~components/List.vue'
    ]
  },

  // plugin settings
  plugins: [
    { src: '~plugins/bootstrap', ssr: false },
    '~plugins/api',
    { src: '~plugins/vue-infinite', ssr: false },
    { src: '~plugins/mousetrap', ssr: false },
    { src: '~plugins/ga', ssr: false }
  ],

  // router settings
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        name: '@name-posts-id',
        path: '/@:name/posts/:id?',
        component: resolve(__dirname, 'pages/posts/_id.vue')
      })
    },
    scrollBehavior (to, from, savedPosition) {
      // default + alpha
      if (savedPosition) {
        return savedPosition
      } else {
        let position = {}
        if (to.matched.length < 2) {
          position = { x: 0, y: 0 }
        } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
          position = { x: 0, y: 0 }
        }
        if (to.hash) {
          position = { selector: to.hash }
        }

        // go to post page first time
        if (to.params.id) {
          const el = document.querySelector(`#post-${to.params.id}`)
          if (el) {
            position = {
              x: 0,
              y: el.getBoundingClientRect().top - 100
            }
          }
        }
        return position
      }
    }
  },
  cache: true
}
