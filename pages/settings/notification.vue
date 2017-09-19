<template>
  <div>
    <div class="card">
      <div class="card-body">
        <notification />
      </div>
    </div>
  </div>
</template>

<script>
import Notification from '~/components/settings/Notification'
export default {
  components: {
    Notification
  },
  head () {
    return {
      title: 'Notification settings'
    }
  }
}
</script>
