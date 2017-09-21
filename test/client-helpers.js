import Vue from 'vue'
import Vuex from 'vuex'
Vue.config.productionTip = false
Vue.config.devtools = false
Vue.config.silent = true
Vue.use(Vuex)

export const getVm = (VueComponent, opts) => {
  const Ctor = Vue.extend(VueComponent)
  return new Ctor(opts).$mount()
}
