<template>
  <div>
    <compose />
    <post-list :data="data" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Compose from '~/components/Compose.vue'
import PostList from '~/components/PostList.vue'
import { Post } from '~/models/post'

export default Vue.extend({
  components: {
    PostList,
    Compose
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource<Post>()
    return { data }
  },
  head() {
    return {
      title: 'Trending'
    }
  }
})
</script>
