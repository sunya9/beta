<template>
  <div>
    <div>
      <list all :data="before" :option="option" type="Post" v-if="before.data.length" :key="`${id}-before`" />
    </div>
    <div class="mb-4 post">
      <post :data="post" detail :key="`post-${post.id}`" />
    </div>
    <div>
      <list all :data="after" :option="option" type="Post" v-if="after.data.length" :key="`${id}-after`" />
    </div>
  </div>
</template>

<script>
import Post from '~components/Post'
import Compose from '~components/Compose'
import List from '~components/List'
import api from '~plugins/api'
import bus from '~assets/js/bus'

export default {
  async asyncData(ctx) {
    const { params: { id }, req } = ctx
    const _api = api(ctx)
    const option = {
      include_directed_posts: 1
    }
    const postPromise = _api.fetch({
      include_directed_posts: 1,
      include_bookmarked_by: 1,
      include_reposted_by: 1
    })
    const beforePromise = _api.get(`/posts/${id}/thread`, {
      before_id: id,
      include_directed_posts: 1
    })
    const afterPromise = _api.get(`/posts/${id}/thread`, {
      since_id: id,
      include_directed_posts: 1
    })
    const [{ data: post }, before, after] = await Promise.all([
      postPromise,
      beforePromise,
      afterPromise
    ])
    before.data = before.data.reverse()
    after.data = after.data.reverse()
    return {
      post, before, after, id, option
    }
  },
  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },
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
    addAfter (post) {
      this.after.push(post)
    }
  },
  head() {
    let title = this.post.content.text
    if(title.length > 30) {
      title = title.substr(0, 30) + '…'
    }
    const name = this.post.user.name
      ? this.post.user.name
      : `@${this.post.user.username}`
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