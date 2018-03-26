import { getResourcePath } from './resources'

export default (context, inject) => {
  const { $axios, route, error, app, req } = context
  if (process.server) {
    if (req.user && req.user.token) {
      $axios.setToken(req.user.token, 'bearer')
    } else {
      $axios.setToken(null)
    }
  }
  const injectResource = route => {
    const url = getResourcePath(route)
    if (url) {
      const $resource = (options = {}) => {
        return $axios.$get(url, {
          params: {
            include_post_raw: 1,
            include_directed_posts: 0,
            ...options
          }
        })
      }
      inject('resource', $resource)
    }
  }
  injectResource(route)
  app.router.beforeEach((to, from, next) => {
    injectResource(to)
    next()
  })
  $axios.onError(err => {
    const code = parseInt(err.response && err.response.status)
    if (code === 401) {
      // clear session
      // don't use `redirect`
      location.href = '/logout'
    } else {
      if (process.server) {
        error(err.message)
      } else if (process.client) {
        app.$toast.error(err.message)
      }
    }
  })
}
