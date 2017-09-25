import Vue from 'vue'
import Vuex from 'vuex'
import NuxtLink from 'nuxt/lib/app/components/nuxt-link'
import createStore from '~/store'
import '../fixtures/axios-mock'

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.config.silent = true
Vue.use(Vuex)
Vue.component('nuxt-link', NuxtLink)

export {
  createStore
}
export * from 'avoriaz'
