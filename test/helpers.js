import Vue from 'vue'
import Vuex from 'vuex'
import request from 'supertest'
import koaApp from '../app'

Vue.config.productionTip = false
Vue.config.devtools = false
Vue.config.silent = true
Vue.use(Vuex)

export const getVm = (VueComponent, opts) => {
  const Ctor = Vue.extend(VueComponent)
  return new Ctor(opts).$mount()
}

export const app = request()
export class ServerHepler {
  constructor () {
    this.app = koaApp
    this.server = null
    this.context = null
  }
  listen () {
    this.server = this.app.listen(process.env.PORT || 3333)
    return this
  }
  get client () {
    return request(this.server)
  }
  close () {
    if (this.server) {
      this.server.close()
    }
  }
}
