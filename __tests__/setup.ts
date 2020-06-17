import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import './axios-mock'
import '~/plugins/font-awesome'
import { config, RouterLinkStub } from '@vue/test-utils'
import '~/plugins/modal'
import '~/plugins/emojify'
import dayjs from 'dayjs'
import { NuxtAxiosInstance } from '@nuxtjs/axios'
import { getAccessorType, getterTree } from 'nuxt-typed-vuex'
import { BootstrapVue } from 'bootstrap-vue'
import { getters } from '~/store'
import { authedUserCreateStore } from '~/../__tests__/helper'
import '~/plugins/dayjs'

Vue.use(Vuex)
Vue.use(BootstrapVue)

config.stubs = {
  'client-only': {
    functional: true,
    render: (h, context) => h('div', context.data, context.children),
  },
  // emoji picker
  picker: {
    render: (h) => h('div'),
  },
  'nuxt-link': RouterLinkStub,
}

const state = () => authedUserCreateStore().state
const $accessor = getAccessorType({
  state,
  getters: getterTree(state, getters),
})

if (config.mocks) config.mocks.$accessor = $accessor

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
      const axiosmod = axios as any
      axiosmod[`$${method}`] = function <T>(
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
    Vue.prototype.$dayjs = dayjs
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
    Vue.prototype.$accessor = $accessor
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
