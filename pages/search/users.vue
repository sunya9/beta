<template>
  <user-list :key="options.q" :data="data" :option="options">
    <span slot="empty"> No results for {{ options.q }} </span>
  </user-list>
</template>
<script lang="ts">
import Vue from 'vue'
import search from '~/assets/ts/search'
import UserList from '~/components/UserList.vue'

export default Vue.extend({
  components: {
    UserList
  },
  mixins: [search],
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'User',
      q: query.q
    }
    const data = await $resource({ options })
    return {
      data,
      options
    }
  },
  head() {
    const title: string = (this as any).title
    return {
      title
    }
  }
})
</script>
