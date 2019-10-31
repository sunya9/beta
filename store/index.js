function getData(auth, key) {
  return auth && auth.user && auth.user.data && auth.user.data[key]
}

export const getters = {
  user({ auth }) {
    return getData(auth, 'user')
  },
  storage({ auth }) {
    return (
      getData(auth, 'storage') || {
        available: 0
      }
    )
  }
}
