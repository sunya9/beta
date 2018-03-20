<template>
  <notifications />
</template>

<script>
import Notifications from '~/components/settings/Notifications'
export default {
  components: {
    Notifications
  },
  head() {
    return {
      title: 'Notification settings'
    }
  }
}
</script>
