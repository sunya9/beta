import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    user: null
  },

  mutations: {
    SET_USER: function (state, user) {
      state.user = user
    }
  },

  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.user) {
        commit('SET_USER', req.user._json)
      }
    }
  }
})

export default store
