<template>
  <div>
    <div>
      <profile :profile="profile" />
    </div>
    <div>
      <compose :initial-text="`@${name} `" :key="`${name}-compose`" />
    </div>
    <div>
      <list :data="data" type="Post" :key="`${name}-posts`" :option="option" />
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
    const { params, error } = ctx
    const { name } = params
    const _api = api(ctx)
    const { data: profile } = await _api.get(`/users/@${name}`)
    const option = {
      include_directed_posts: 1
    }
    const data = await _api.fetch(option)
    if(data.meta.code < 400) {
      return {
        data, profile, name, option
      }
    } else {
      error({
        statusCode: data.meta.code,
        message: data.meta.error_message
      })
    }
  },
  components: {
    Profile,
    Compose,
    List
  },
  head() {
    return {
      title: `@${this.name}`
    }
  }
}
</script>