<template>
  <div>
    <compose />
    <post-list
      :data="data"
      :option="option"
      :refresh-date="date"
    />
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'
import refreshAfterAdded from '~/assets/js/refresh-after-added'

export default {
  middleware: ['auth'],
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
  mixins: [refreshAfterAdded],
  head() {
    return {
      title: 'Mentions'
    }
  }
}
</script>
