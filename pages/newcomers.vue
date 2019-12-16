<template>
  <div>
    <compose />
    <post-list :data="data" :option="options" disable-auto-refresh />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Compose from '~/components/Compose.vue'
import PostList from '~/components/PostList.vue'

export default Vue.extend({
  components: {
    PostList,
    Compose
  },
  async asyncData({ app: { $resource } }) {
    const options = {
      include_directed_posts:
        localStorage.hide_directed_posts === 'true' ? 0 : 1
    }
    const data = await $resource({ options })
    return { data, options }
  },
  head() {
    return {
      title: 'Newcomers'
    }
  }
})
</script>
