import Vue from 'vue'
import { Plugin } from '@nuxt/types'
import Modal from './modal'

Vue.use(Modal)

const plugin: Plugin = (_, inject) => {
  inject('modal', Modal)
}

export default plugin
