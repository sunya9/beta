import Vuex from 'vuex'

export default () =>
  new Vuex.Store({
    getters: {
      user({ auth }) {
        return auth && auth.user && auth.user.data && auth.user.data.user
      },
      storage({ auth }) {
        return auth && auth.user && auth.user.data && auth.user.data.storage
      }
    }
  })
