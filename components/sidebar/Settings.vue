<script>
import Sidebar from './Sidebar'

export default {
  extends: Sidebar,
  data() {
    const menus = [
      { type: 'heading', label: 'User' },
      {
        label: 'Profile',
        icon: 'fa-user',
        url: '/settings'
      },
      {
        label: 'Blocked accounts',
        icon: 'fa-user-times',
        url: '/settings/blocked-accounts'
      },
      {
        label: 'Muted accounts',
        icon: 'fa-eye-slash',
        url: '/settings/muted-accounts'
      },
      {
        label: 'Account',
        icon: 'fa-cog',
        normal: true,
        url: 'https://pnut.io/account'
      },
      { type: 'heading', label: 'App' },
      {
        label: 'Display',
        icon: 'fa-paint-brush',
        url: '/settings/display'
      },
      {
        label: 'Notifications',
        icon: 'fa-bell',
        url: '/settings/notifications'
      }
    ]
    return {
      menus
    }
  }
}
</script>
