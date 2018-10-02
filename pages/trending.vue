<template>
  <div>
    <compose />
    <post-list :data="data" />
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'

export default {
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  components: {
    PostList,
    Compose
  },
  head() {
    return {
      title: 'Trending'
    }
  }
}
</script>
