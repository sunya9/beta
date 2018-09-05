import Vue from 'vue'
import Modal from './modal'

Vue.use(Modal)

export default (app, inject) => {
  inject('modal', Modal)
}
