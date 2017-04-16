<template>
  <div>
    <div>
      <profile :profile="profile" />
    </div>
    <div>
      <stream :stream="stream" title="" />
    </div>
  </div>
</template>

<script>
import Stream from '~components/Stream'
import Profile from '~components/Profile'
import axios from '~plugins/axios'

export default {
  layout: 'app',
  async asyncData(ctx) {
    const { req, isServer, res, store, params } = ctx
    const headers = isServer
      ? {
        Cookie: req.headers['cookie']
      }
      : {}
    const { name } = params
    console.log('name: %s', name)
    const { data: { data: profile }} = await axios.get(`/users/@${name}`, {
      headers
    })
    const { data: { data: stream }} = await axios.get(`/users/@${name}/posts`, {
      headers
    })
    console.log(stream)
    return {
      stream, profile
    }
  },
  components: {
    Stream,
    Profile
  }
}
</script>