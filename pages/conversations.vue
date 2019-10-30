<template>
  <div>
    <compose />
    <post-list :data="data" :option="option" :refresh-date="date" />
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'
import refreshAfterAdded from '~/assets/js/refresh-after-added'

export default {
  components: {
    PostList,
    Compose
  },
  mixins: [refreshAfterAdded],
  async asyncData({ app: { $resource } }) {
    const option = {
      include_directed_posts:
        localStorage.hide_directed_posts === 'true' ? 0 : 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  head() {
    return {
      title: 'Conversations'
    }
  }
}
</script>
