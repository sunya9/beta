<template>
  <div>
      <h3>Conversations</h3>
      <div>
        <compose />
      </div>
      <div>
        <list :items="data" type="Post" />
      </div>
  </div>
</template>

<script>
import Compose from '~components/Compose'
import List from '~components/List'
import api from '~plugins/api'

export default {
  async asyncData(ctx) {
    const { store } = ctx
    const { id } = store.state.user
    const { data } = await api(ctx, '/posts/streams/explore/conversations')
    return { data }
  },
  components: {
    List,
    Compose
  }
}
</script>