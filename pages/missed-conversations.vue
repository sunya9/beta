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
  components: {
    PostList,
    Compose
  },
  async asyncData({ app: { $resource } }) {
    const option = {
      include_directed_posts:
        localStorage['hide_directed_posts'] === 'true' ? 0 : 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  head() {
    return {
      title: 'Missed Conversations'
    }
  }
}
</script>
