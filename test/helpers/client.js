import Vue from 'vue'
import Vuex from 'vuex'
import NuxtLink from 'nuxt/lib/app/components/nuxt-link'
import VueRouter from 'vue-router'
import createStore from '~/store'
import '../fixtures/axios-mock'
import sinon from 'sinon'
import axios from 'axios'

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.config.silent = true
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.component('nuxt-link', NuxtLink)

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
      axios['$' + method] = function() {
        return this[method].apply(this, arguments).then(res => res && res.data)
      }
    }
    Vue.prototype.$axios = axios
  }
})

beforeEach(() => {
  Vue.prototype.$toast = {
    error: sinon.stub(),
    success: sinon.stub()
  }
})

const router = new VueRouter()
export { createStore, router }
export * from '@vue/test-utils'
