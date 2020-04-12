<script lang="ts">
import Vue from 'vue'
import Sidebar from './Sidebar.vue'

export default Vue.extend({
  extends: Sidebar,
  data() {
    const menus = [
      { type: 'heading', label: 'User' },
      {
        label: 'Profile',
        icon: 'user',
        url: '/settings',
      },
      {
        label: 'Blocked accounts',
        icon: 'user-times',
        url: '/settings/blocked-accounts',
      },
      {
        label: 'Muted accounts',
        icon: 'eye-slash',
        url: '/settings/muted-accounts',
      },
      {
        label: 'Account',
        icon: 'user-cog',
        normal: true,
        url: 'https://pnut.io/account',
      },
      { type: 'heading', label: 'App' },
      {
        label: 'Stream',
        icon: 'home',
        url: '/settings/stream',
      },
      {
        label: 'Display',
        icon: 'paint-brush',
        url: '/settings/display',
      },
      {
        label: 'Notifications',
        icon: 'bell',
        url: '/settings/notifications',
      },
    ]
    return {
      menus,
    }
  },
})
</script>
