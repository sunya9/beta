<template>
  <list
    :data="data"
    :key="options.q"
    :option="options"
    type="Post">
    <span slot="empty">No results for {{ options.q }}</span>
  </list>
</template>
<script>
import search from '~/assets/js/search'
import List from '~/components/List'

export default {
  components: {
    List
  },
  mixins: [search],
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'Post',
      q: query.q,
      order: 'id'
    }
    const data = await $resource(options)
    return {
      data,
      options
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
