<template>
  <div>
    <user-list
      :data="data"
      :component-options="options"
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
  data() {
    return {
      options: {
        disableFollowButton: true,
        showUnmuteButton: true
      }
    }
  },
  head() {
    return {
      title: 'Muted Accounts'
    }
  }
}
</script>
