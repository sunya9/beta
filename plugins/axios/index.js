import { getResourcePath } from './resources'

export default (context, inject) => {
  const { $axios, error, app, req } = context
  let resourcePath
  if (process.server) {
    if (req.user && req.user.token) {
      $axios.setToken(req.user.token, 'bearer')
    } else {
      $axios.setToken(null)
    }
  }
  const $resource = (options = {}) => {
    return $axios.$get(resourcePath, {
      params: {
        include_post_raw: 1,
        include_directed_posts: 0,
        ...options
      }
    })
  }
  inject('resource', $resource)
  app.router.beforeEach((to, from, next) => {
    resourcePath = getResourcePath(to)
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
        app.$toast.error(err.response.data.meta.error_message || err.message)
      }
    }
  })
}
