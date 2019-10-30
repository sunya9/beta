import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import './axios-mock'
import '~/plugins/font-awesome'
import { config, RouterLinkStub } from '@vue/test-utils'
import Modal from '~/plugins/modal/modal'
import Emojify from '~/plugins/emojify/Emojify'

Vue.use(Vuex)
Vue.use(Modal)
[
  // dummy directives
  ('on-click-outside', 'infinite-scroll', 'shortkey')
].forEach(directive => {
  Vue.directive(directive, {
    bind: () => {},
    unbind: () => {}
  })
})

config.stubs['no-ssr'] = {
  functional: true,
  render: (h, context) => h('div', context.data, context.children)
}

// emoji picker
config.stubs.picker = {
  render: h => h('div')
}

config.stubs.emojify = Emojify

config.stubs['nuxt-link'] = RouterLinkStub

config.mocks.$mousetrap = {
  bind() {},
  unbind() {},
  pause() {},
  unpause() {}
}

Vue.use({
  install(Vue) {
    // https://github.com/nuxt-community/axios-module/blob/27aa4bdc7746d84d063fe9cfa34850bc6f08e141/lib/plugin.template.js#L37
    for (const method of [
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

    // $resource

    Vue.prototype.$resource = (url = '', options = {}) => {
      return axios.$get(url, {
        params: {
          include_post_raw: 1,
          include_directed_posts: 0,
          include_message_raw: 1,
          ...options
        }
      })
    }
  }
})
