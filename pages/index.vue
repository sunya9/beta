<template>
  <div>
    <div v-if="user">
      <h3>Your Stream</h3>
      <div>
        <compose @post="add" />
      </div>
      <div>
        <list :data="data" type="Post" />
      </div>
    </div>
  </div>
</template>


<script>
import Compose from '~components/Compose'
import List from '~components/List'
import { mapState } from 'vuex'
import api from '~plugins/api'

export default {
  components: {
    Compose,
    List
  },
  async asyncData(ctx) {
    if(ctx.store.state.user) {
      const data = await api(ctx).fetch()
      return { data }
    }
  },
  computed: mapState(['user']),
  methods: {
    add(post) {
      this.data.data.unshift(post)
    }
  },
  head: {
    title: 'Your Stream'
  }
}
</script>