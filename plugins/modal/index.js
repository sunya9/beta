import Vue from 'vue'
import Modal from './modal'

Vue.use(Modal)

export default (_, inject) => {
  inject('modal', Modal)
}
