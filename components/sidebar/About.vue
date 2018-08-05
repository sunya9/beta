<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data() {
    const user = this.$store.state.user
    const menus = [
      { type: 'heading', label: 'About' },
      {
        label: 'Beta',
        icon: 'fa-info-circle',
        url: '/about'
      },
      {
        label: 'Stats',
        icon: 'fa-bar-chart',
        url: '/about/stats',
        hidden: !user
      },
      { type: 'heading', label: 'Resources' },
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
