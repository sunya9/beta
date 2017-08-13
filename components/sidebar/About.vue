<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data () {
    const menus = [
      {type: 'heading', label: 'About'},
      {
        label: 'Beta',
        icon: 'fa-info-circle',
        url: '/about'
      },
      {type: 'heading', label: 'Resources'},
      {
        label: 'Bookmarklet',
        icon: 'fa-bookmark',
        url: '/about/bookmarklet'
      }
    ]
    return {
      menus
    }
  }
}
</script>