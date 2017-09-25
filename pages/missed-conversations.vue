<template>
  <div>
      <h3>Missed Conversations</h3>
      <div>
        <compose />
      </div>
      <div>
        <list :data="data" type="Post" :option="option" ref="list" />
      </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import api from '~/plugins/api'

export default {
  async asyncData(ctx) {
    const option = {
      include_directed_posts: 1
    }
    const data = await api(ctx).fetch(option)
    return { data, option }
  },
  components: {
    List,
    Compose
  },
  head: {
    title: 'Missed Conversations'
  }
}
</script>
