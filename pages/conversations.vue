<template>
  <div>
    <compose />
    <post-list :data="data" :option="options" :refresh-date="date" />
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
    const options = {
      include_directed_posts:
        localStorage.hide_directed_posts === 'true' ? 0 : 1
    }
    const data = await $resource({ options })
    return { data, options }
  },
  head() {
    return {
      title: 'Conversations'
    }
  }
})
</script>
