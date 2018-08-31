<template>
  <div>
    <div>
      <compose />
    </div>
    <div>
      <list
        ref="list"
        :data="data"
        type="Post" />
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import bus from '~/assets/js/bus'

export default {
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return { data }
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
      title: 'Photos'
    }
  }
}
</script>
