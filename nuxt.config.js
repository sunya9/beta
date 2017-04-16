const { ProvidePlugin } = require('webpack')

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Beta',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'beta is pnut.io client.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
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
  loading: { color: '#3B8070' },

  // webpack build setttings
  build: {
    plugins: [
      new ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.Tether': 'tether',
        Tether: 'tether'
      })
    ],
    vendor: ['isomorphic-fetch', 'es6-promise', 'jquery', 'bootstrap', 'tether']
  },

  // plugin settings
  plugins: ['~plugins/bootstrap.js'],

  // router settings
  router: {
    linkActiveClass: 'active'
  },

  // env
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  }
}
