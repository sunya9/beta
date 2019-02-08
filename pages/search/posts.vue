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
    <post-list
      :key="options.q"
      :data="data"
      :option="options"
    >
      <span slot="empty">
        No results for {{ options.q }}
      </span>
    </post-list>
  </div>
</template>
<script>
import search from '~/assets/js/search'
import PostList from '~/components/PostList'
import { getRSSLink } from '~/assets/js/util'

export default {
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
