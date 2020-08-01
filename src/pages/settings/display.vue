<template>
  <display />
</template>

<script lang="ts">
import Vue from 'vue'
import Display from '~/components/molecules/settings/Display.vue'
export default Vue.extend({
  components: {
    Display,
  },
  head() {
    return {
      title: 'Display settings',
    }
  },
})
</script>
