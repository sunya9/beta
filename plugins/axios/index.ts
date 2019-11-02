import { NuxtAppOptions, Plugin } from '@nuxt/types'
import { AxiosError } from 'axios'
import { convertPageId2ApiPath } from './resources'
import { PnutResponse } from '~/models/pnut-response'

function setupRouter(
  app: NuxtAppOptions,
  callback: (resourcePath: string) => void
): void {
  if (!app.router) throw new Error('Not found app.router')
  app.router.beforeEach((to, _, next) => {
    const path = convertPageId2ApiPath(to)
    if (path) {
      callback(path)
    }
    next()
  })
}

const injecter: Plugin = (context, inject) => {
  const { error, app } = context
  const { $axios } = app
  let resourcePath: string

  function showError(err: AxiosError) {
    if (!err || !err.response || !err.response.status) return
    const statusCode = err.response.status
    error({
      statusCode,
      message: err.message
    })
  }

  function $resource<T>(url = '', options = {}): Promise<PnutResponse<T>> {
    if (typeof url === 'object') {
      options = url
      url = ''
    }

    $axios.onError(err => {
      if (process.server) {
        showError(err)
      } else {
        // app.$toast.error(err.response.data.meta.error_message || err.message)
      }
    })

    try {
      const res = $axios.$get(url || resourcePath, {
        params: {
          include_post_raw: 1,
          include_message_raw: 1,
          include_deleted: 0,
          ...options
        }
      })
      return res
    } catch (err) {
      showError(err)
      return Promise.reject(err)
    }
  }

  setupRouter(app, path => {
    resourcePath = path
  })
  inject('resource', $resource)
}

export default injecter
