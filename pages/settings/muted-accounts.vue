<template>
  <div>
    <list
      :data="data"
      :component-options="options"
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
