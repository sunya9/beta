<template>
  <div>
    <div class="card">
      <div class="card-body">
        <notifications />
      </div>
    </div>
  </div>
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
