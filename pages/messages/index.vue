<template>
	<div>
		<h1 class="h3">Messages</h1>
		<div class="row">
			<div class="col-md-8">
				<h2 class="h4">Create a channel</h2>
				<message-compose create-channel-mode />
				<h2 class="h4">Recent messages</h2>
				<div class="list-group" v-infinite-scroll="fetch" infinite-scroll-disabled="moreDisabled" infinite-scroll-distance="100">
					<channel class="list-group-item list-group-item-action" v-for="channel in channels" :key="channel.id" :channel="channel" />
					<div class="list-group-item" v-show="meta.more">
						<div class="text-center w-100 text-muted my-2">
							<i class="fa fa-spin fa-refresh fa-fw fa-2x"></i>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import MessageCompose from '~/components/MessageCompose'
import Channel from '~/components/Channel'

export default {
  middleware: 'authenticated',
  data() {
    return {
      busy: false
    }
  },
  async asyncData({ app: { $resource } }) {
    const options = {
      include_recent_message: 1,
      channel_types: 'io.pnut.core.pm,io.pnut.core.chat',
      include_limited_users: 1,
      include_channel_raw: 1
    }
    const { data: channels, meta } = await $resource(options)
    return { channels, meta, options }
  },
  methods: {
    async fetch() {
      this.busy = true
      const { data: channels, meta } = await this.$resource(this.options)
      this.channels = channels
      this.meta = meta
      this.busy = false
    }
  },
  computed: {
    moreDisabled() {
      return this.busy || !this.meta.more
    }
  },
  head() {
    return {
      title: 'Messages'
    }
  },
  components: {
    MessageCompose,
    Channel
  }
}
</script>
