<template>
  <div>
    <div v-if="user">
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
import { mapGetters } from 'vuex'
import bus from '~/assets/js/bus'

export default {
  components: {
    Compose,
    List
  },
  async asyncData({ app: { $resource }, store }) {
    if (store.getters.user) {
      const data = await $resource()
      return { data }
    }
  },
  mounted() {
    bus.$on('post', this.add)
  },
  beforeDestroy() {
    bus.$off('post', this.add)
  },
  computed: mapGetters(['user']),
  methods: {
    add() {
      this.$refs.list.refresh()
    }
  },
  head() {
    return {
      title: this.$store.getters.user ? 'Your Stream' : null
    }
  }
}
</script>
