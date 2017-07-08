import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    }
  },
  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.user) {
        const user = Object.assign({}, req.user)
        delete user.token
        commit('SET_USER', user)
      }
    }
  }
})

export default store
