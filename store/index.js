import Vuex from 'vuex'

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
