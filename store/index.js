import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default () =>
  new Vuex.Store({
    getters: {
      user({ auth }) {
        return getData(auth, 'user')
      },
      storage({ auth }) {
        return getData(auth, 'storage')
      }
    }
  })

function getData(auth, key) {
  return auth && auth.user && auth.user.data && auth.user.data[key]
}
