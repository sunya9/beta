<template>
  <div>
    <list :data="data" type="Poll" :option="option" ref="list" />
  </div>
</template>
<script>
import Compose from '~/components/Compose'
import List from '~/components/List'

export default {
  async asyncData({ app: { $resource } }) {
    const option = {}
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    List,
    Compose
  },
  head() {
    return {
      title: 'Polls'
    }
  }
}
</script>
