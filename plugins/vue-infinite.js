import Vue from 'vue'

if (process.BROWSER_BUILD) {
  const infiniteScroll = require('vue-infinite-scroll')
  Vue.use(infiniteScroll)
}
