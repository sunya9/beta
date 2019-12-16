<template>
  <div>
    <p>
      <a :href="$metaInfo.link[0].href">
        <font-awesome-icon icon="rss-square" size="lg" />
        RSS
      </a>
    </p>
    <post-list :key="options.q" :data="data" :option="options">
      <span slot="empty"> No results for {{ options.q }} </span>
    </post-list>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import search from '~/assets/ts/search'
import PostList from '~/components/PostList.vue'
import { getRSSLink } from '~/assets/ts/util'

export default Vue.extend({
  components: {
    PostList
  },
  mixins: [search],
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'Post',
      q: query.q,
      order: 'id'
    }
    const data = await $resource({ options })
    return {
      data,
      options
    }
  },
  head() {
    const link = [
      getRSSLink(
        `https://api.pnut.io/v0/feed/rss/posts/search?q=${this.$route.query.q}&order=id`
      )
    ]
    // TODO
    const title: string = (this as any).title
    return {
      title,
      link
    }
  }
})
</script>
