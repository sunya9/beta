<template>
  <div>
    <h3>Post</h3>
    <div class="mt-3">
      <post :data="post" />
    </div>
    <div>
      <compose />
    </div>
  </div>
</template>

<script>
import Post from '~components/Post'
import Compose from '~components/Compose'
import api from '~plugins/api'

export default {
  async asyncData(ctx) {
    const { params: { id } } = ctx
    const { data: post } = await api(ctx).fetch()
    return {
      post
    }
  },
  components: {
    Post, Compose
  }
}
</script>