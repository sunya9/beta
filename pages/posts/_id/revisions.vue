<template>
  <div>
    <post-list
      :key="`post-${id}`"
      :main="id"
      :data="data"
      :option="options"
      :refresh-date="date"
      disable-auto-refresh
      all
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import PostList from '~/components/PostList.vue'
import { getImageURLs } from '~/assets/ts/util'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'

export default Vue.extend({
  components: {
    PostList,
  },
  mixins: [refreshAfterAdded],
  async asyncData(ctx) {
    const {
      params: { id },
      app: { $resource },
    } = ctx
    const options = {
      include_directed_posts: 1,
      include_bookmarked_by: 1,
      include_reposted_by: 1,
    }
    const postPromise: Promise<PnutResponse<Post[]>> = $resource({ options })

    const data = await postPromise
    data.data = data.data ? data.data.reverse() : []
    return {
      id,
      options,
      data,
    }
  },
  validate({ params }) {
    return /^\w+$/.test(params.name) && /\d+$/.test(params.id)
  },
  head() {
    // TODO
    const data = (this as any).data as PnutResponse<Post[]>
    const [post] = data.data.filter((post) => post.id === (this as any).id)
    if (post.user && post.content) {
      const name = post.user.name
        ? `${post.user.name}(@${post.user.username})`
        : `@${post.user.username}`
      const fullTitle = `${name}: ${post.content.text}`
      const title =
        fullTitle.length > 50 ? `${fullTitle.substr(0, 50)}…` : fullTitle
      const meta = [
        { hid: 'description', name: 'description', content: fullTitle },
        {
          hid: 'og:description',
          property: 'og:description',
          content: fullTitle,
        },
        { hid: 'og:title', property: 'og:title', content: title },
      ]
      const [photo] = getImageURLs(post, true)
      if (photo) {
        meta.push(
          {
            hid: 'og:image',
            property: 'og:image',
            content: photo.original,
          },
          {
            hid: 'og:image:width',
            property: 'og:image:width',
            content: photo.width.toString(),
          },
          {
            hid: 'og:image:height',
            property: 'og:image:height',
            content: photo.height.toString(),
          },
          {
            hid: 'og:type',
            property: 'og:type',
            content: 'article',
          },
          {
            hid: 'article:published_time',
            property: 'article:published_time',
            content: post.created_at.toString(),
          },
          {
            hid: 'article:author',
            property: 'article:author',
            content: post.user.username,
          }
        )
      }
      return {
        title,
        meta,
      }
    }
    return {}
  },
})
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.post {
  @include no-gutter-xs;
}
</style>
