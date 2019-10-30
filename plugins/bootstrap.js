const { Collapse } = require('bootstrap.native')
export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    next()
    // hide collapse immediately
    initCollapse(true)
  })

  app.watch.$route = async () => {
    await app.router.app.$nextTick()
    // initialize collapse
    initCollapse()
  }
}

function initCollapse(hide = false) {
  ;['globalNavigation', 'navbarSupportedContent'].forEach(id => {
    const button = document.querySelector(`[aria-controls="${id}"]`)
    if (!button) return
    const collapse = new Collapse(button)
    if (!hide) return
    collapse.hide()
  })
}
