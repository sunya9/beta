import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({
  state: {
    user: null,
    composeText: '',
    replyTarget: null
  },

  mutations: {
    SET_USER (state, user) {
      state.user = user
    },
    SET_REPLY (state, post) {
      const text = `@${post.user.username} `
      state.replyTarget = post
      if (text !== state.composeText) {
        state.composeText = text + state.composeText
      }
    },
    REMOVE_REPLY (state) {
      state.replyTarget = null
    },
    UPDATE_COMPOSE (state, text) {
      state.composeText = text
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
