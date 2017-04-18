<template>
  <div>
    <h3>
      <nuxt-link to=".">
        @{{name}}
      </nuxt-link>
      's followers
    </h3>
    <list :data="data" type="User" />
  </div>
</template>

<script>
import List from '~components/List'
import api from '~plugins/api'

export default {
  async asyncData(ctx) {
    const { params } = ctx
    const { name } = params
    const { data } = await api(ctx).fetch()
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