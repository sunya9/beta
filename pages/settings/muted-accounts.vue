<template>
	<div>
		<list :data="data" type="User" :component-options="options" />
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
  data() {
    return {
      options: {
        disableFollowButton: true,
        showUnmuteButton: true
      }
    }
  },
  components: {
    List
  },
  head() {
    return {
      title: 'Muted Accounts'
    }
  }
}
</script>
