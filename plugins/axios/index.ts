import { NuxtAppOptions, Plugin } from '@nuxt/types'
import { AxiosError } from 'axios'
import { convertPageId2ApiPath } from './resources'
import { PnutResponse } from '~/models/pnut-response'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
const plugin: Plugin = (context, inject) => {
  const { error, app, route } = context
  const { $axios } = app
  // let resourcePath: string

  function showError(err: AxiosError) {
    if (!err || !err.response || !err.response.status) return
    const statusCode = err.response.status
    error({
      statusCode,
      message: err.message
    })
  }

  function $resource<T>(option?: {
    url?: string
    options?: object
  }): Promise<PnutResponse<T>> {
    $axios.onError((err: AxiosError) => {
      if (process.server) {
        showError(err)
      } else {
        // app.$toast.error(err.response.data.meta.error_message || err.message)
      }
    })

    const resourcePath = convertPageId2ApiPath(route.fullPath)

    const url = option && option.url ? option.url : resourcePath

    try {
      const extendOptions = option ? option.options : {}
      const res = $axios.$get(url, {
        params: {
          include_post_raw: 1,
          include_message_raw: 1,
          include_deleted: 0,
          ...extendOptions
        }
      })
      return res
    } catch (err) {
      showError(err)
      return Promise.reject(err)
    }
  }

  // setupRouter(app, path => {
  //   resourcePath = path
  // })
  inject('resource', $resource)
}
export default plugin
