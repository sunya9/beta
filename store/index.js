import Vue from 'vue'
import Vuex from 'vuex'
import api from '~/plugins/api'

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
    async nuxtServerInit ({ commit }, ctx) {
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
