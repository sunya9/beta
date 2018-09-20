<template>
  <div>
    <user-list
      :data="data"
    />
  </div>
</template>
<script>
import UserList from '~/components/UserList'

export default {
  async asyncData({ app: { $resource } }) {
    const data = await $resource()
    return {
      data
    }
  },
  components: {
    UserList
  },
  head() {
    return {
      title: 'Blocked Accounts'
    }
  }
}
</script>
