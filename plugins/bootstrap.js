import 'bootstrap'
import $ from 'jquery'

export default ({ app }) => {
  app.router.afterEach(() => {
    $('#navbarSupportedContent, #globalNavigation').collapse('hide')
  })
}
