<template>
  <div>
    <compose />
    <post-list :data="data" :refresh-date="date" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Compose from '~/components/Compose.vue'
import PostList from '~/components/PostList.vue'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'

export default Vue.extend({
  components: {
    PostList,
    Compose
  },
  mixins: [refreshAfterAdded],
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
  },
  head() {
    return {
      title: 'Photos'
    }
  }
})
</script>
