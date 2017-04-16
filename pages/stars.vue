<template>
  <div>
    <stream :stream="stream.data" title="Stars" />
  </div>
</template>

<script>
import Stream from '~components/Stream'
import axios from '~plugins/axios'

export default {
  layout: 'app',
  async asyncData(ctx) {
    const { req, isServer, res, store } = ctx
    const headers = isServer
      ? {
        Cookie: req.headers['cookie']
      }
      : {}
    const { id } = store.state.user
    const { data: stream } = await axios.get(`/users/${id}/bookmarks`, {
      headers
    })
    return {
      stream
    }
  },
  components: {
    Stream
  }
}
</script>