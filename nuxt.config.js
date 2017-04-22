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
      { hid: 'description', name: 'description', content: 'beta is pnut.io client.' },

    ],
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat' }
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
    vendor: ['jquery', 'tether', 'axios', 'vue-infinite-scroll']
  },

  // plugin settings
  plugins: [
    '~plugins/bootstrap',
    '~plugins/api',
    '~plugins/vue-infinite'
  ],

  // router settings
  router: {
    // linkActiveClass: 'active'
  },

  // env
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  cache: true
}
