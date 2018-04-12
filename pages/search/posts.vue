<template>
  <list :data="data" type="Post" :key="options.q" :option="options">
    <span slot="empty">No results for {{options.q}}</span>
  </list>
</template>
<script>
import search from '~/assets/js/search'
import List from '~/components/List'

export default {
  mixins: [search],
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'Post',
      q: encodeURIComponent(query.q),
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
  },
  components: {
    List
  }
}
</script>
