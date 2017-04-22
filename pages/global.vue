<template>
  <div>
      <h3>Global</h3>
      <div>
        <compose @post="add" />
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
    const data = await api(ctx).fetch({
      include_directed_posts: 1
    })
    return { data }
  },
  components: {
    List,
    Compose
  },
  methods: {
    add(post) {
      this.data.data.unshift(post)
    }
  },
  head: {
    title: 'Global'
  }
}
</script>