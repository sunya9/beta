<template>
  <div>
    <list :main="id" all :data="data" :option="option" type="Post" :key="`post-${id}`" :auto-refresh="false" />
  </div>
</template>

<script>
import Post from '~/components/Post'
import Compose from '~/components/Compose'
import List from '~/components/List'
import api from '~/plugins/api'
import bus from '~/assets/js/bus'

export default {
  async asyncData(ctx) {
    const { params: { id } } = ctx
    const _api = api(ctx)
    const option = {
      include_directed_posts: 1,
      include_bookmarked_by: 1,
      include_reposted_by: 1
    }
    const postPromise = _api.fetch({
      include_directed_posts: 1,
      include_bookmarked_by: 1,
      include_reposted_by: 1
    })

    const data = await postPromise
    data.data = data.data ? data.data.reverse() : []
    return {
      id, option, data
    }
  },
  // validate ({ params }) {
  //   return /^\d+$/.test(params.id)
  // },
  mounted() {
    bus.$on('post', this.addAfter)
  },
  beforeDestroy() {
    bus.$off('post', this.addAfter)
  },
  components: {
    Post, Compose, List
  },
  methods: {
    addAfter(post) {
      // TODO: push post to list if post target is this page's post
      // this.data.data.push(post)
    }
  },
  head() {
    const [post] = this.data.data
      .filter(post => post.id === this.id)
    let title = post.content.text
    if (title.length > 30) {
      title = title.substr(0, 30) + '…'
    }
    const name = post.user.name
      ? `${post.user.name}(@${post.user.username})`
      : `@${post.user.username}`
    title = `${name}: ${title}`
    return {
      title
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/mixin';


.post {
  @include no-gutter-xs
}
</style>
