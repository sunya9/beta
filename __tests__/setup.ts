import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import './axios-mock'
import '~/plugins/font-awesome'
import { config, RouterLinkStub } from '@vue/test-utils'
import '~/plugins/modal'
import '~/plugins/emojify'
import moment from 'moment'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

Vue.use(Vuex)

config.stubs = {
  'no-ssr': {
    functional: true,
    render: (h, context) => h('div', context.data, context.children),
  },
  // emoji picker
  picker: {
    render: (h) => h('div'),
  },
  'nuxt-link': RouterLinkStub,
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
      'patch',
    ]) {
      ;(axios as any)[`$${method}`] = function <T>(
        this: NuxtAxiosInstance
      ): Promise<T> {
        return (this as any)[method]
          .apply(this, arguments)
          .then((res: { data: T }) => res && res.data)
      }
    }
    Vue.prototype.$axios = axios

    // $resource

    Vue.prototype.$resource = (url = '', options = {}) => {
      return (axios as any).$get(url, {
        params: {
          include_post_raw: 1,
          include_directed_posts: 0,
          include_message_raw: 1,
          ...options,
        },
      })
    }
    Vue.prototype.$mousetrap = {
      bind() {},
      unbind() {},
      pause() {},
      unpause() {},
    }
    Vue.prototype.$moment = moment
    ;[
      // dummy directives
      'on-click-outside',
      'infinite-scroll',
      'shortkey',
    ].forEach((directive) => {
      Vue.directive(directive, {
        bind: () => {},
        unbind: () => {},
      })
    })
    // Vue.prototype.$toast = {
    //   error: jest.fn(),
    //   success: jest.fn()
    // }
    Vue.prototype.$auth = {
      loginWith: jest.fn(),
      logout: jest.fn(),
    }
    Vue.prototype.$toast = {
      error: jest.fn(),
      success: jest.fn(),
    }
  },
})
