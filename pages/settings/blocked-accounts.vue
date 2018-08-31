<template>
  <div>
    <list
      :data="data"
      type="User" />
  </div>
</template>
<script>
import List from '~/components/List'

export default {
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return {
      data
    }
  },
  components: {
    List
  },
  head() {
    return {
      title: 'Blocked Accounts'
    }
  }
}
</script>
