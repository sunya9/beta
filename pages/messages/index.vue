<template>
	<div>
		<h1 class="h3">Messages</h1>
		<div class="row">
			<div class="col-md-8">
				<h2 class="h4">Create a channel</h2>
				<message-compose create-channel-mode />
				<h2 class="h4">Recent messages</h2>
				<div>
          <list :data="data" type="Channel" :option="option" ref="list" />
        </div>
			</div>
		</div>
	</div>
</template>

<script>
import MessageCompose from '~/components/MessageCompose'
import List from '~/components/List'
import bus from '~/assets/js/bus'

export default {
  middleware: 'authenticated',
  async asyncData({ app: { $resource } }) {
    const option = {
      include_recent_message: 1,
      channel_types: 'io.pnut.core.pm,io.pnut.core.chat',
      include_limited_users: 1,
      include_channel_raw: 1
    }
    const data = await $resource(option)
    return { data, option }
  },
  components: {
    List,
    MessageCompose
  },
  mounted() {
    bus.$on('channel', this.add)
  },
  beforeDestroy() {
    bus.$off('channel', this.add)
  },
  methods: {
    add() {
      this.$refs.list.refresh()
    }
  },
  head() {
    return {
      title: 'Messages'
    }
  }
}
</script>
