<template>
  <div>
      <h3>Conversations</h3>
      <div>
        <compose />
      </div>
      <div>
        <list :data="data" type="Post" :option="option" ref="list" />
      </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import api from '~/plugins/api'
import bus from '~/assets/js/bus'

export default {
  async asyncData (ctx) {
    const option = {
      include_directed_posts: 1
    }
    const data = await api(ctx).fetch(option)
    return { data, option }
  },
  mounted () {
    bus.$on('post', this.add)
  },
  beforeDestroy () {
    bus.$off('post', this.add)
  },
  methods: {
    add (post) {
      this.$refs.list.refresh()
    }
  },
  components: {
    List,
    Compose
  },
  head: {
    title: 'Conversations'
  }
}
</script>
