<template>
  <div>
    <div v-if="user">
      <h3>Your Stream</h3>
      <div>
        <compose />
      </div>
      <div>
        <list :data="data" type="Post" ref="list" />
      </div>
    </div>
  </div>
</template>


<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import { mapState } from 'vuex'
import api from '~/plugins/api'
import bus from '~/assets/js/bus'

export default {
  components: {
    Compose,
    List
  },
  async asyncData (ctx) {
    if (ctx.store.state.user) {
      const data = await api(ctx).fetch()
      return { data }
    }
  },
  mounted () {
    bus.$on('post', this.add)
  },
  beforeDestroy () {
    bus.$off('post', this.add)
  },
  computed: mapState(['user']),
  methods: {
    add (post) {
      this.$refs.list.refresh()
    }
  },
  head: {
    title: 'Your Stream'
  }
}
</script>