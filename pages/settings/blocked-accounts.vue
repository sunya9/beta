<template>
  <div>
    <user-list :data="data" />
  </div>
</template>
<script>
import UserList from '~/components/UserList'

export default {
  components: {
    UserList
  },
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return {
      data
    }
  },
  head() {
    return {
      title: 'Blocked Accounts'
    }
  }
}
</script>
