<template>
  <div>
    <h3 class="d-flex align-items-center mb-4">
      Your polls
    </h3>
    <poll-list
      :data="data"
    />
  </div>
</template>
<script>
import Compose from '~/components/Compose'
import PollList from '~/components/PollList'

export default {
  middleware: ['auth'],
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  components: {
    PollList,
    Compose
  },
  head() {
    return {
      title: 'Your polls'
    }
  }
}
</script>
