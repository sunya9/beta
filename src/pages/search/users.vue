<template>
  <user-list :key="options.q" :data="data" :option="options">
    <span slot="empty">No results for {{ options.q }}</span>
  </user-list>
</template>
<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import search from '~/assets/ts/search'
import UserList from '~/components/UserList.vue'

@Component({
  components: {
    UserList,
  },
  head(this: UserSearch) {
    const title: string = this.title
    return {
      title,
    }
  },
  async asyncData({ app: { $resource }, query }) {
    const options = {
      type: 'User',
      q: query.q,
    }
    const data = await $resource({ options })
    return {
      data,
      options,
    }
  },
})
export default class UserSearch extends Mixins(search) {}
</script>
