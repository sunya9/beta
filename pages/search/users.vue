<template>
  <list :data="data" type="User" :key="options.q" :option="options" />
</template>
<script>
import api from '~/plugins/api'
import search from '~/assets/js/search'
import List from '~/components/List'

export default {
  mixins: [search],
  async asyncData (ctx) {
    const { query } = ctx
    const options = {
      type: 'User',
      q: encodeURIComponent(query.q)
    }
    const data = await api(ctx).fetch(options)
    return {
      data, options
    }
  },
  head () {
    return {
      title: this.title
    }
  },
  components: {
    List
  }
}
</script>
