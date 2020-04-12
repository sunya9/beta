import { Collapse } from 'bootstrap.native'
import { Plugin } from '@nuxt/types'

function initCollapse(hide = false) {
  ;['globalNavigation', 'navbarSupportedContent'].forEach((id) => {
    const button = document.querySelector(`[aria-controls="${id}"]`)
    if (!button) return
    const collapse = new Collapse(button)
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
    await app.$nextTick()
    // initialize collapse
    initCollapse()
  }
}
export default plugin
