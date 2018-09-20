<template>
  <div>
    <compose />
    <post-list
      :data="data"
      :refresh-date="date"
    />
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'
import refreshAfterAdded from '~/assets/js/refresh-after-added'

export default {
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  components: {
    PostList,
    Compose
  },
  mixins: [refreshAfterAdded],
  head() {
    return {
      title: 'Photos'
    }
  }
}
</script>
