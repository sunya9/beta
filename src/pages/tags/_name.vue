<template>
  <div>
    <emojify :text="`#${name}`" element="h3" />
    <a
      :href="'https://api.pnut.io/v0/feed/rss/posts/tags/' + name"
      class="card-link"
    >
      <font-awesome-icon icon="rss-square" aria-hidden="true" class="mr-2" />
      <span>RSS</span>
    </a>
    <post-list :key="name" :list-info="listInfo" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import PostList from '~/components/organisms/PostList.vue'
import { getRSSLink } from '~/assets/ts/util'
import { Post } from '~/models/post'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  components: {
    PostList,
  },
  async asyncData({ app: { $interactors }, params }) {
    const { name } = params
    const { listInfo } = await $interactors.getPosts.run({
      type: 'hashtag',
      tag: name,
    })
    return {
      listInfo,
      name,
    }
  },
  head(this: Tag) {
    const link = [
      getRSSLink(`https://api.pnut.io/v0/feed/rss/posts/tags/${this.name}`),
    ]
    return {
      title: `#${this.name}`,
      link,
    }
  },
})
export default class Tag extends Vue {
  name!: string
  listInfo!: ListInfo<Post>
}
</script>
