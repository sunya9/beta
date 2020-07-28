import BSN from 'bootstrap.native'
import { Plugin } from '@nuxt/types'
import Vue from 'vue'

function initCollapse(hide = false) {
  ;['globalNavigation', 'navbarSupportedContent'].forEach((id) => {
    const button = document.querySelector(`[aria-controls="${id}"]`)
    if (!button) return
    const collapse = new BSN.Collapse(button)
    if (!hide) return
    collapse.hide()
  })
}

const plugin: Plugin = ({ app }) => {
  if (!app.router || !app.watch) return
  app.router.beforeEach((_, __, next) => {
    next()
    // hide collapse immediately
    initCollapse(true)
  })

  app.watch.$route = async () => {
    await Vue.nextTick()
    // initialize collapse
    initCollapse()
  }
}
export default plugin
