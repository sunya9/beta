import { getResourcePath } from './resources'
import { scope } from '../../lib/util'
import _ from 'lodash'

export default (context, inject) => {
  const { $axios, error, app, req, redirect } = context
  const logout = () => {
    const url = '/logout'
    if (process.client) {
      location.href = url
    } else {
      redirect(url)
    }
  }
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
    if (code === 401) {
      // clear session
      // don't use `redirect`
      logout()
    } else if (code === 404) {
      // ignore 404
    } else {
      if (process.server) {
        error({
          statusCode: code,
          message: err.message
        })
      } else if (process.client) {
        app.$toast.error(err.response.data.meta.error_message || err.message)
        const serverScope = err.response.headers['x-oauth-scopes'].split(',')
        const clientScope = scope.split(' ')
        if (_.difference(clientScope, serverScope).length) {
          logout()
        }
      }
    }
  })
}
