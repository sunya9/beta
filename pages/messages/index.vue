<template>
  <div>
    <h1 class="h3">Messages</h1>
    <div class="row">
      <div class="col-md-8">
        <h2 class="h4">Create a channel</h2>
        <message-compose
          create-cannel
          @submit="createChannel"
          prevent-handle
          v-model="message"
        >
          <div class="form-group" slot="header">
            <input
              type="text"
              v-model="channelUsersStr"
              class="form-control"
              placeholder="usernames(commma or space delimited)"
            />
          </div>
        </message-compose>
        <h2 class="h4">Recent messages</h2>
        <div
          class="list-group"
           v-infinite-scroll="fetch"
           infinite-scroll-disabled="moreDisabled"
           infinite-scroll-distance="100"
        >
          <channel
            class="list-group-item list-group-item-action"
            v-for="channel in channels"
            :key="channel.id"
            :channel="channel"
          />
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
import api from '~/plugins/api'
import MessageCompose from '~/components/MessageCompose'
import Channel from '~/components/Channel'

export default {
  middleware: 'authenticated',
  data() {
    return {
      channelUsersStr: '',
      message: '',
      busy: false
    }
  },
  async asyncData(ctx) {
    const options = {
      include_recent_message: 1,
      channel_types: 'io.pnut.core.pm'
    }
    const { data: channels, meta } = await api(ctx).fetch(options)
    return { channels, meta, options }
  },
  methods: {
    async fetch() {
      this.busy = true
      const { data: channels, meta } = await api({
        route: this.$route
      }).fetch(this.options)
      this.channels = channels
      this.meta = meta
      this.busy = false
    },
    async createChannel() {
      const destinations = this.channelUsersStr.split(/,\s+/g).map(name => {
        return name.startsWith('@') ? name : `@${name}`
      })
      const option = {
        text: this.message,
        destinations
      }
      const { data: channel } = await api().post(
        '/channels/pm/messages',
        option
      )
      this.channelUsersStr = ''
      this.message = ''
      this.$router.push(`/messages/${channel.channel_id}`)
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
