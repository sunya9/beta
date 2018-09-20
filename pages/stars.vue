<template>
  <div>
    <div>
      <compose />
    </div>
    <div>
      <post-list
        :data="data"
      />
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import PostList from '~/components/PostList'

export default {
  middleware: ['auth'],
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
      title: 'Stars'
    }
  }
}
</script>
