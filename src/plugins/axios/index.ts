import querystring from 'querystring'
import { Plugin } from '@nuxt/types'
import { NuxtAxiosInstance } from '@nuxtjs/axios'

function modifyParameterSerializer(axios: NuxtAxiosInstance) {
  axios.onRequest((config) => {
    config.paramsSerializer = (params) => {
      const entries = Object.entries(params).reduce<[string, any][]>(
        (obj, [key, value]) => {
          if (typeof value === 'undefined') return obj
          const newValue = typeof value === 'boolean' ? +value : value
          return obj.concat([[key, newValue]])
        },
        []
      )
      const obj = Object.fromEntries(entries)
      return querystring.stringify(obj)
    }
  })
}

const plugin: Plugin = (context) => {
  const {
    app: { $axios, $toast },
  } = context
  $axios.onResponseError((error) => {
    $toast.error(`${error.code}: ${error.message}`)
  })
  modifyParameterSerializer($axios)
}
export default plugin
