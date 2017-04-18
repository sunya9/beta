<template>
  <div>
    <div>
      <profile :profile="profile" />
    </div>
    <div>
      <compose :initial-text="`@${name} `" />
    </div>
    <div>
      <list :data="data" type="Post" />
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
    const _api = api(ctx)
    const { data: profile } = await _api.get(`/users/@${name}`)
    const data = await _api.fetch()
    return {
      data, profile, name
    }
  },
  components: {
    Profile,
    Compose,
    List
  }
}
</script>