<template>
  <user-list
    :data="data"
    :key="options.q"
    :option="options"
  >
    <span slot="empty">No results for {{ options.q }}</span>
  </user-list>
</template>
<script>
import search from '~/assets/js/search'
import UserList from '~/components/UserList'

export default {
  components: {
    UserList
  },
  mixins: [search],
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'User',
      q: query.q
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
