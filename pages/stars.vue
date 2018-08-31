<template>
  <div>
    <div>
      <compose />
    </div>
    <div>
      <list
        :data="data"
        type="Post" />
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'

export default {
  middleware: ['auth'],
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  components: {
    List,
    Compose
  },
  head() {
    return {
      title: 'Stars'
    }
  }
}
</script>
