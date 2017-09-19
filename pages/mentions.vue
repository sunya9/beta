<template>
  <div>
      <h3>Mentions</h3>
      <div>
        <compose />
      </div>
      <div>
        <list :data="data" type="Post" :option="option" />
      </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import api from '~/plugins/api'

export default {
  middleware: 'authenticated',
  async asyncData (ctx) {
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
    title: 'Mentions'
  }
}
</script>
