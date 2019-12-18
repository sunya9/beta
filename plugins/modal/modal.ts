import { PluginObject } from 'vue'
import mediator from './mediator'
import PromiseModal from './PromiseModal.vue'

const modalObj = {
  show: mediator.show,
  ok: mediator.ok,
  cancel: mediator.cancel
}

const plugin: PluginObject<never> = {
  install(Vue) {
    Vue.prototype.$modal = modalObj
    Vue.component('promise-modal', PromiseModal)
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $modal: typeof modalObj
  }
}
export default plugin
