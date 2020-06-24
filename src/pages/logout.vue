<template>
  <div />
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'loading',
  middleware: ['auth'],
  async mounted() {
    await this.$auth.logout()
    this.$nuxt.context.redirect('/')
  },
})
</script>
