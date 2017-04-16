<template>
  <div>
    <h3>
      <nuxt-link to=".">
        @{{name}}
      </nuxt-link>
      's followers
    </h3>
    <list :items="users" type="User" />
  </div>
</template>

<script>
import List from '~components/List'
import api from '~plugins/api'

export default {
  layout: 'app',
  async asyncData(ctx) {
    const { params } = ctx
    const { name } = params
    const { data: users } = await api(ctx, `/users/@${name}/followers`)
    return {
      users,
      name
    }
  },
  components: {
    List
  }
}
</script>