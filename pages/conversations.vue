<template>
  <div>
      <h3>Conversations</h3>
      <div>
        <compose />
      </div>
      <div>
        <list :data="data" type="Post" />
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
    const data = await api(ctx).fetch({
      include_directed_posts: 1
    })
    return { data }
  },
  components: {
    List,
    Compose
  },
  head: {
    title: 'Conversations'
  }
}
</script>