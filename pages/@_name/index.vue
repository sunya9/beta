<template>
  <div>
    <div>
      <profile :profile="profile" />
    </div>
    <div>
      <compose />
    </div>
    <div>
      <list :items="stream" type="Post" />
    </div>
  </div>
</template>

<script>
import Profile from '~components/Profile'
import Compose from '~components/Compose'
import List from '~components/List'
import api from '~plugins/api'


export default {
  async asyncData(ctx) {
    const { params } = ctx
    const { name } = params
    const { data: profile } = await api(ctx, `/users/@${name}`)
    const { data: stream } = await api(ctx, `/users/@${name}/posts`)
    return {
      stream, profile
    }
  },
  components: {
    Profile,
    Compose,
    List
  }
}
</script>