<template>
  <stream />
</template>

<script lang="ts">
import Vue from 'vue'
import Stream from '~/components/settings/Stream.vue'
export default Vue.extend({
  components: {
    Stream
  },
  head() {
    return {
      title: 'Stream settings'
    }
  }
})
</script>
