import { getResourcePath } from './resources'

export default (context, inject) => {
  const { $axios, error, app } = context
  let resourcePath
  const $resource = (options = {}) => {
    return $axios.$get(resourcePath, {
      params: {
        include_post_raw: 1,
        include_directed_posts: 0,
        include_message_raw: 1,
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
    if (process.server) {
      error({
        statusCode: code,
        message: err.message
      })
    } else {
      app.$toast.error(err.response.data.meta.error_message || err.message)
    }
  })
}
