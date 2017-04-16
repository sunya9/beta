<template>
  <div>
    <splash v-if="!user" />
    <div v-else>
      <h3>Your Stream</h3>
      <compose />
      <list :items="data" type="Post" />
    </div>
  </div>
</template>


<script>
import Splash from '~/components/Splash'
import Compose from '~/components/Compose'
import List from '~/components/List'
import { mapState } from 'vuex'
import api from '~plugins/api'

export default {
  layout: ({ req, store }) => {
    return (req && req.user)
      || (store && store.state.user)
        ? 'app'
        : 'default'
  },
  components: {
    Splash,
    Compose,
    List
  },
  async asyncData(ctx) {
    const { store } = ctx
    const user = store.state
    const { data } = await api(ctx, '/posts/streams/me')
    return {
      user, data
    }
  },
}
</script>