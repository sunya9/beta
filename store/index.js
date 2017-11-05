import Vue from 'vue'
import Vuex from 'vuex'
import api from '~/plugins/api'

Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    user: null,
    hide_directed_posts: false,
    square_avatars: false,
    unified_timeline: false
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_DIRECTED(state, value) {
      state.hide_directed_posts = value
    },
    SET_SQUARE(state, value) {
      state.square_avatars = value
    },
    SET_UNIFIED(state, value) {
      state.unified_timeline = value
    }
  },
  actions: {
    async nuxtServerInit({ commit }, ctx) {
      const { req } = ctx
      if (req.user) {
        const { data: { storage } } = await api(ctx).request('/token').catch(() => ({data: {}}))
        const user = Object.assign({}, req.user, {
          storage
        })
        delete user.token
        commit('SET_USER', user)
      }
    }
  }
})

export default store
