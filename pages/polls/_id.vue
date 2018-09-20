<template>
  <poll-list
    :data="data"
    :options="options"
    disable-auto-refresh
  />
</template>
<script>
import PollList from '~/components/PollList'

export default {
  components: {
    PollList
  },
  async asyncData({ app: { $resource } }) {
    const options = {}
    const data = await $resource()
    return {
      data: {
        ...data,
        data: [data.data]
      },
      options
    }
  }
}
</script>
