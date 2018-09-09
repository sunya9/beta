<template>
  <div
    :key="$route.fullPath"
    class="row">
    <div class="col-md-4 order-md-2">
      <component
        :initial-channel.sync="channel"
        :is="panel"
        :is-moderator="isModerator"
      />
    </div>
    <div class="col-md-8 order-md-1">
      <message-compose
        v-if="canPost"
        v-model="message"
        @submit="() => $refs.list.refresh()" />
      <div class="card no-gutter-xs">
        <div class="card-body">
          <List
            ref="list"
            :data="data"
            :is-moderator="isModerator"
            :channel-type="channel.type"
            :last-read-message-id="data.meta.marker.id"
            type="Message" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import List from '~/components/List'
import MessageCompose from '~/components/MessageCompose'
import { mapGetters } from 'vuex'
import ChatPanel from '~/components/ChatPanel.js'
import ChannelPanel from '~/components/ChannelPanel'
import markAsRead from '~/assets/js/mark-as-read'

export default {
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  components: {
    List,
    MessageCompose
  },
  mixins: [markAsRead],
  data() {
    return {
      message: ''
    }
  },
  async asyncData({ app: { $axios, $resource }, params, error }) {
    const messagesPromise = $resource()
    const channelPromise = $axios.$get(`/channels/${params.channel}`, {
      params: {
        include_limited_users: 1,
        include_channel_raw: 1
      }
    })
    try {
      const [data, { data: channel }] = await Promise.all([
        messagesPromise,
        channelPromise
      ])
      return {
        data,
        channel
      }
    } catch (e) {
      const { code, error_message } = e.response.data.meta
      error({
        statusCode: code,
        message: error_message
      })
    }
  },
  computed: {
    panel() {
      return this.isPM ? ChannelPanel : ChatPanel
    },
    ...mapGetters(['user']),
    isModerator() {
      return (
        this.user &&
        (this.user.id === this.channel.owner.id ||
          !!this.channel.acl.full.user_ids.find(u => u.id === this.user.id))
      )
    },
    isPM() {
      return this.channel.type === 'io.pnut.core.pm'
    },
    canPost() {
      return this.user && this.channel.acl.write.you
    }
  },
  watch: {
    '$route.fullPath': {
      handler() {
        this.$emit('updateNav', this.isPM)
      },
      immediate: true
    }
  },
  mounted() {
    setTimeout(() => this.markAsRead(), 1000)
  }
}
</script>
