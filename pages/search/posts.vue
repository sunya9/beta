<template>
  <div>
    <p>
      <a :href="$metaInfo.link[0].href">
        <font-awesome-icon
          icon="rss-square"
          size="lg"
        />
        RSS
      </a>
    </p>
    <list
      :data="data"
      :key="options.q"
      :option="options"
      type="Post">
      <span slot="empty">No results for {{ options.q }}</span>
    </list>
  </div>
</template>
<script>
import search from '~/assets/js/search'
import List from '~/components/List'
import { getRSSLink } from '~/assets/js/util'

export default {
  components: {
    List
  },
  mixins: [search],
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'Post',
      q: query.q,
      order: 'id'
    }
    const data = await $resource(options)
    return {
      data,
      options
    }
  },
  head() {
    const link = [
      getRSSLink(
        `https://api.pnut.io/v0/feed/rss/posts/search?q=${
          this.$route.query.q
        }&order=id`
      )
    ]
    return {
      title: this.title,
      link
    }
  }
}
</script>
