<template>
  <splash v-if="!user" />
  <stream v-else :stream="stream.data" title="Your Stream" />
</template>


<script>
import Splash from '~/components/Splash'
import Stream from '~/components/Stream'
import { mapState } from 'vuex'
import axios from '~plugins/axios'
// import pnut from '../lib/pnut'

export default {
  layout: ({ req, store }) => {
    return (req && req.user)
      || (store && store.state.user)
        ? 'app'
        : 'default'
  },
  components: {
    Splash,
    Stream
  },
  async asyncData(ctx) {
    const { req, isServer, res, store } = ctx
    const headers = isServer
      ? {
        Cookie: req.headers['cookie']
      }
      : {}
    const user = store.state
    console.log(user)
    const { data: stream } = await axios.get('/posts/streams/me', {
      headers
    })
    return {
      stream,
      user
    }
  },
  // computed: mapState(['user'])
}
</script>