<template>
  <div>
    <p>
      <a :href="rssLink">
        <font-awesome-icon icon="rss-square" size="lg" />
        RSS
      </a>
    </p>
    <post-list :key="options.q" :data="data" :option="options">
      <span slot="empty">No results for {{ options.q }}</span>
    </post-list>
  </div>
</template>
<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import search from '~/assets/ts/search'
import PostList from '~/components/PostList.vue'
import { getRSSLink } from '~/assets/ts/util'

@Component({
  components: {
    PostList,
  },
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'Post',
      q: query.q,
      order: 'id',
    }
    const data = await $resource({ options })
    return {
      data,
      options,
    }
  },
  head(this: SearchPosts) {
    const link = [this.rssLink]
    const title: string = this.title
    return {
      title,
      link,
    }
  },
})
export default class SearchPosts extends Mixins(search) {
  get rssLink() {
    return getRSSLink(
      `https://api.pnut.io/v0/feed/rss/posts/search?q=${this.$route.query.q}&order=id`
    )
  }
}
</script>
