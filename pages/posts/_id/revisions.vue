<template>
  <div>
    <post-list
      :key="`post-${id}`"
      :main="id"
      :data="data"
      :option="option"
      :refresh-date="date"
      disable-auto-refresh
      all
    />
  </div>
</template>

<script>
import PostList from '~/components/PostList'
import { getImageURLs } from '~/assets/js/util'
import refreshAfterAdded from '~/assets/js/refresh-after-added'

export default {
  components: {
    PostList
  },
  mixins: [refreshAfterAdded],
  async asyncData(ctx) {
    const {
      params: { id },
      app: { $resource }
    } = ctx
    const option = {
      include_directed_posts: 1,
      include_bookmarked_by: 1,
      include_reposted_by: 1
    }
    const postPromise = $resource(option)

    const data = await postPromise
    data.data = data.data ? data.data.reverse() : []
    return {
      id,
      option,
      data
    }
  },
  validate({ params }) {
    return /^\w+$/.test(params.name) && /\d+$/.test(params.id)
  },
  head() {
    const [post] = this.data.data.filter(post => post.id === this.id)
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
          content: fullTitle
        },
        { hid: 'og:title', property: 'og:title', content: title }
      ]
      const [photo] = getImageURLs(post, true)
      if (photo) {
        meta.push(
          {
            hid: 'og:image',
            property: 'og:image',
            content: photo.original
          },
          {
            hid: 'og:image:width',
            property: 'og:image:width',
            content: photo.width
          },
          {
            hid: 'og:image:height',
            property: 'og:image:height',
            content: photo.height
          },
          {
            hid: 'og:type',
            property: 'og:type',
            content: 'article'
          },
          {
            hid: 'article:published_time',
            property: 'article:published_time',
            content: post.created_at
          },
          {
            hid: 'article:author',
            property: 'article:author',
            content: post.user.username
          }
        )
      }
      return {
        title,
        meta
      }
    }
    return {}
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';

.post {
  @include no-gutter-xs;
}
</style>
