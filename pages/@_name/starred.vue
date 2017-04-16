<template>
  <div>
    <stream :stream="stream" :title="`@${this.name}'s Starred`" />
  </div>
</template>

<script>
import api from '~plugins/api'

export default {
  layout: 'app',
  async asyncData(ctx) {
    const { req, isServer, params } = ctx
    const headers = isServer
      ? {
        Cookie: req.headers['cookie']
      }
      : {}
    const { name } = params
    const { data: { data: stream } } = await axios.get(`/users/@${name}/bookmarks`, {
      headers
    })
    return {
      stream,
      name
    }
  },
  components: {
    List
  }
}
</script>