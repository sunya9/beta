<template>
  <div>
    <div>
      <list :data="before" type="Post" v-if="before.data.length" :key="`${id}-before`" />
    </div>
    <div>
      <post :data="post" @post="addAfter" detail />
    </div>
    <div>
      <compose focus />
    </div>
    <div>
      <list :data="after" type="Post" v-if="after.data.length" :key="`${id}-after`" />
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
    const { params: { id } } = ctx
    const _api = api(ctx)
    const postPromise = _api.fetch()
    const beforePromise = _api.get(`/posts/${id}/thread`, {
      before_id: id
    })
    const afterPromise = _api.get(`/posts/${id}/thread`, {
      since_id: id
    })
    const [{ data: post }, before, after] = await Promise.all([
      postPromise,
      beforePromise,
      afterPromise
    ])
    before.data = before.data.reverse()
    after.data = after.data.reverse()
    return {
      post, before, after, id
    }
  },
  validate ({ params }) {
    return /^\d+$/.test(params.id)
  },
  components: {
    Post, Compose, List
  },
  mounted() {
    bus.$emit('setReply', this.post)
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
    title = `${this.post.user.name}: ${title}`
    return {
      title
    }
  }
}
</script>