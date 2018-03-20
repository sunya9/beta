<template>
  <stream />
</template>

<script>
import Stream from '~/components/settings/Stream'
export default {
  components: {
    Stream
  },
  head() {
    return {
      title: 'Stream settings'
    }
  }
}
</script>
