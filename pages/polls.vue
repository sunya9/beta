<template>
	<div>
		<h3 class="d-flex align-items-center mb-4">
			Your polls
		</h3>
		<list :data="data" type="Poll" :option="option" ref="list" />
	</div>
</template>
<script>
import Compose from '~/components/Compose'
import List from '~/components/List'

export default {
  middleware: ['auth'],
  async asyncData({ app: { $resource } }) {
    const option = {}
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    List,
    Compose
  },
  head() {
    return {
      title: 'Your polls'
    }
  }
}
</script>
