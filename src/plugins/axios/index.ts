import { Plugin } from '@nuxt/types'

const plugin: Plugin = (context) => {
  const { app, $toast } = context
  const { $axios } = app
  $axios.onResponseError((error) => {
    $toast.error(`${error.code}: ${error.message}`)
  })
}
export default plugin
