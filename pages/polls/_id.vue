<template>
  <list
    :data="data"
    :auto-refresh="false"
    :options="options"
    type="Poll" />
</template>
<script>
import List from '~/components/List'

export default {
  components: {
    List
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
