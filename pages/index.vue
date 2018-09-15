<template>
  <div>
    <compose v-if="user" />
    <splash
      v-else
      class="mb-5" />
    <list
      ref="list"
      :data="data"
      :resource="resource"
      type="Post" />
  </div>
</template>


<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import { mapGetters } from 'vuex'
import bus from '~/assets/js/bus'
import { getResourcePath } from '~/plugins/axios/resources'
import Splash from '~/components/Splash'

const globalPath = getResourcePath('global')

export default {
  components: {
    Compose,
    List,
    Splash
  },
  async asyncData({ app: { $resource }, store }) {
    const data = await $resource(!store.getters.user ? globalPath : '')
    return { data }
  },
  computed: {
    ...mapGetters(['user']),
    resource() {
      return !this.user ? getResourcePath('global') : ''
    }
  },
  mounted() {
    bus.$on('post', this.add)
  },
  beforeDestroy() {
    bus.$off('post', this.add)
  },
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
