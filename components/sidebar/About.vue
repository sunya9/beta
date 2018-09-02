<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data() {
    const { user } = this.$store.getters
    const menus = [
      { type: 'heading', label: 'About' },
      {
        label: 'Beta',
        icon: 'info-circle',
        url: '/about'
      },
      {
        label: 'Stats',
        icon: 'chart-bar',
        url: '/about/stats',
        hidden: !user
      },
      { type: 'heading', label: 'Resources' },
      {
        label: 'Bookmarklet',
        icon: 'bookmark',
        url: '/about/bookmarklet'
      }
    ]
    return {
      menus
    }
  }
}
</script>
