import mediator from './mediator'
import PromiseModal from './PromiseModal'

export default {
  install(Vue) {
    Vue.prototype.$modal = {
      show: mediator.show,
      ok: mediator.ok,
      cancel: mediator.cancel
    }
    Vue.component('promise-modal', PromiseModal)
  }
}
