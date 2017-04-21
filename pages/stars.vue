<template>
  <div>
      <h3>Stars</h3>
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
    const data = await api(ctx).fetch()
    return { data }
  },
  components: {
    List,
    Compose
  },
  head: {
    title: 'Stars'
  }
}
</script>