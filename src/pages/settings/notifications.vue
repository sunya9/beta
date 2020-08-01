<template>
  <notifications />
</template>

<script lang="ts">
import Vue from 'vue'
import Notifications from '~/components/molecules/settings/Notifications.vue'
export default Vue.extend({
  components: {
    Notifications,
  },
  head() {
    return {
      title: 'Notification settings',
    }
  },
})
</script>
