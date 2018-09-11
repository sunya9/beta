import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import axios from 'axios'
import './axios-mock'
import '~/plugins/font-awesome'
import Modal from '~/plugins/modal/modal'
import '~/plugins/emojify'

Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(Modal)

Vue.directive('emojify', {
  bind: () => {},
  unbind: () => {}
})
Vue.directive('on-click-outside', {
  bind: () => {},
  unbind: () => {}
})

Vue.component('no-ssr', {
  functional: true,
  render: (h, context) => h('div', context.data, context.children)
})

// emoji picker
Vue.component('picker', {
  render: h => h('div')
})

Vue.use({
  install(Vue) {
    // https://github.com/nuxt-community/axios-module/blob/27aa4bdc7746d84d063fe9cfa34850bc6f08e141/lib/plugin.template.js#L37
    for (let method of [
      'request',
      'delete',
      'get',
      'head',
      'options',
      'post',
      'put',
      'patch'
    ]) {
      axios[`$${method}`] = function() {
        return this[method].apply(this, arguments).then(res => res && res.data)
      }
    }
    Vue.prototype.$axios = axios
  }
})

jest.mock('~/plugins/mousetrap', () => ({
  bind() {},
  unbind() {},
  pause() {},
  unpause() {}
}))
