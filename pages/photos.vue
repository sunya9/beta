<template>
  <div>
    <div>
      <compose />
    </div>
    <div>
      <list :data="data" type="Post" ref="list" />
    </div>
  </div>
</template>

<script>
import Compose from '~/components/Compose'
import List from '~/components/List'
import api from '~/plugins/api'
import bus from '~/assets/js/bus'

export default {
  async asyncData(ctx) {
    const data = await api(ctx).fetch()
    return { data }
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
      title: 'Photos'
    }
  }
}
</script>
