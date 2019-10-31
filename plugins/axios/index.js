import { getResourcePath } from './resources'

export default (context, inject) => {
  const { $axios, error, app } = context
  let resourcePath

  function showError(err) {
    const code = parseInt(err.response && err.response.status)
    error({
      statusCode: code,
      message: err.message
    })
  }

  const $resource = (url = '', options = {}) => {
    if (typeof url === 'object') {
      options = url
      url = ''
    }
    return $axios
      .$get(url || resourcePath, {
        params: {
          include_post_raw: 1,
          include_message_raw: 1,
          include_deleted: 0,
          ...options
        }
      })
      .catch(showError)
  }
  inject('resource', $resource)
  app.router.beforeEach((to, _, next) => {
    resourcePath = getResourcePath(to)
    next()
  })

  $axios.onError(err => {
    if (process.server) {
      showError(err)
    } else {
      // app.$toast.error(err.response.data.meta.error_message || err.message)
    }
  })
}
