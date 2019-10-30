<template>
  <div>
    <h3 class="d-flex align-items-center mb-4">
      Your polls
    </h3>
    <poll-list :data="data" />
  </div>
</template>
<script>
import PollList from '~/components/PollList'

export default {
  middleware: ['auth'],
  components: {
    PollList
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  head() {
    return {
      title: 'Your polls'
    }
  }
}
</script>
