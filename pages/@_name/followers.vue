<template>
  <div>
    <users :users="users">
      <nuxt-link to=".">@{{name}}</nuxt-link>'s followers
    </users>
  </div>
</template>

<script>
import Users from '~components/Users'
import axios from '~plugins/axios'

export default {
  layout: 'app',
  async asyncData(ctx) {
    const { req, isServer, params } = ctx
    const headers = isServer
      ? {
        Cookie: req.headers['cookie']
      }
      : {}
    const { name } = params
    const { data: { data: users } } = await axios.get(`/users/@${name}/followers`, {
      headers
    })
    return {
      users,
      name
    }
  },
  components: {
    Users
  }
}
</script>