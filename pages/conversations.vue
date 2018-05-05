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
  async asyncData({ app: { $resource } }) {
    const option = {
      include_directed_posts: 1
    }
    const data = await $resource(option)
    return { data, option }
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
  components: {
    List,
    Compose
  },
  head() {
    return {
      title: 'Conversations'
    }
  }
}
</script>
