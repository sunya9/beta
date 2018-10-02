<template>
  <div>
    <compose />
    <post-list
      :data="data"
      :option="option"
      disable-auto-refresh
    />
  </div>
</template>
<script>
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'

export default {
  async asyncData({ app: { $resource } }) {
    const option = {
      include_directed_posts: 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    PostList,
    Compose
  },
  head() {
    return {
      title: 'Newcomers'
    }
  }
}
</script>
