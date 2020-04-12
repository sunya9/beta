<template>
  <div>
    <div>
      <compose />
    </div>
    <div>
      <post-list :data="data" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Compose from '~/components/Compose.vue'
import PostList from '~/components/PostList.vue'

export default Vue.extend({
  middleware: ['auth'],
  components: {
    PostList,
    Compose,
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  head() {
    return {
      title: 'Stars',
    }
  },
})
</script>
