<template>
  <div>
    <h1>
      {{ title }}
    </h1>
    <p>
      <a :href="rssLink">
        <font-awesome-icon icon="rss-square" size="lg" />
        RSS
      </a>
    </p>
    <post-list :list-info="listInfo">
      <span slot="empty">No results for {{ keyword }}</span>
    </post-list>
  </div>
</template>
<script lang="ts">
import { Mixins, Component } from 'vue-property-decorator'
import { Search } from '~/assets/ts/search'
import PostList from '~/components/PostList.vue'
import { getRSSLink } from '~/assets/ts/util'
import { Post } from '~/models/post'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  components: {
    PostList,
  },
  async asyncData({ app: { $interactors }, query }) {
    const keyword = query.q.toString()
    const { listInfo, title } = await $interactors.search.run({
      type: 'post',
      params: { q: keyword },
    })
    return {
      listInfo,
      title,
      keyword,
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
export default class SearchPosts extends Mixins(Search) {
  readonly listInfo!: ListInfo<Post>
  get rssLink() {
    return getRSSLink(
      `https://api.pnut.io/v0/feed/rss/posts/search?q=${this.$route.query.q}&order=id`
    )
  }
}
</script>
