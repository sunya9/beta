<template>
  <div>
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
import bus from '~/assets/js/bus'

export default {
  async asyncData({ app: { $resource }, store }) {
    const option = {
      include_directed_posts: store.state.hide_directed_posts ? 0 : 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    List,
    Compose
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
      title: 'Global'
    }
  }
}
</script>
