<template>
  <div>
    <splash v-if="!user" />
    <div v-else>
      <h3>Your Stream</h3>
      <compose @post="add" />
      <list :data="data" type="Post" />
    </div>
  </div>
</template>


<script>
import Splash from '~/components/Splash'
import Compose from '~/components/Compose'
import List from '~/components/List'
import { mapState } from 'vuex'
import api from '~plugins/api'

export default {
  components: {
    Splash,
    Compose,
    List
  },
  async asyncData(ctx) {
    const data = await api(ctx).fetch({
      include_directed_posts: 0
    })
    return { data }
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