<template>
  <div>
    <div>
      <profile :profile="profile" class="mb-4" />
    </div>
    <div>
      <compose :initial-text="initialText" :key="`${name}-compose`" />
    </div>
    <div>
      <list :data="data" type="Post" :key="`${name}-posts`" :option="option" ref="list" />
    </div>
  </div>
</template>

<script>
import Profile from '~components/Profile'
import Compose from '~components/Compose'
import List from '~components/List'
import api from '~plugins/api'
import bus from '~assets/js/bus'
import { mapState } from 'vuex'

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
  computed: {
    ...mapState({
      initialText(state) {
        return state.user && state.user.username === this.name
          ? ''
          : `@${this.name} `
      }
    })
  },
  mounted() {
    bus.$on('post', this.add)
  },
  beforeDestroy() {
    bus.$off('post', this.add)
  },
  methods: {
    add(post) {
      this.$refs.list.refresh()
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