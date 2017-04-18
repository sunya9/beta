<template>
  <div>
    <h3>
      <nuxt-link to=".">
        @{{name}}
      </nuxt-link>
      's Starred
    </h3>
    <list :data="data" type="Post" />
  </div>
</template>

<script>
import api from '~plugins/api'
import List from '~components/List'

export default {
  async asyncData(ctx) {
    const { params } = ctx
    const { name } = params
    const data = await api(ctx).fetch()
    return {
      data,
      name
    }
  },
  components: {
    List
  }
}
</script>