import 'bootstrap'
import $ from 'jquery'

export default ({ app }) => {
  app.router.beforeEach((to, from, next) => {
    next()
    $('#navbarSupportedContent.show, #globalNavigation.show').collapse('hide')
  })
}
