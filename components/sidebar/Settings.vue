<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data () {
    const menus = [
      {type: 'heading', label: 'User'},
      {
        label: 'Account',
        icon: 'fa-user',
        url: '/settings'
      },
      {type: 'heading', label: 'App'},
      {
        label: 'Stream',
        icon: 'fa-list',
        url: '/settings/stream'
      }
    ]
    return {
      menus
    }
  }
}
</script>