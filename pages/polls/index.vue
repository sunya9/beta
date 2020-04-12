<template>
  <div>
    <h3 class="d-flex align-items-center mb-4">
      Your polls
    </h3>
    <poll-list :data="data" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import PollList from '~/components/PollList.vue'

export default Vue.extend({
  middleware: ['auth'],
  components: {
    PollList,
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  head() {
    return {
      title: 'Your polls',
    }
  },
})
</script>
