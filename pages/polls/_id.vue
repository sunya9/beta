<template>
  <poll-list :data="data" :options="options" disable-auto-refresh />
</template>
<script lang="ts">
import Vue from 'vue'
import PollList from '~/components/PollList.vue'

export default Vue.extend({
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
})
</script>
