import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = () =>
  new Vuex.Store({
    state: {
      user: null
    },
    mutations: {
      SET_USER(state, user) {
        state.user = user
      }
    },
    actions: {
      async nuxtServerInit({ commit }, ctx) {
        const { req, app } = ctx

        if (req.user) {
          const { data: { storage } } = await app.$axios
            .$get('/token')
            .catch(() => ({ data: {} }))
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
