import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    user: null,
    reply: null
  },

  mutations: {
    SET_USER (state, user) {
      state.user = user
    },
    SET_REPLY (state, reply) {
      state.reply = reply
    },
    REMOVE_REPLY (state) {
      state.reply = null
    }
  },
  actions: {
    nuxtServerInit ({ commit }, { req }) {
      if (req.user) {
        commit('SET_USER', req.user)
      }
    }
  }
})

export default store
