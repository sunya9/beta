<template>
  <div :key="$route.fullPath" class="row">
    <div class="col-md-4 order-md-2">
      <chat-panel
        v-if="chat"
        :chat="chat"
        :is-moderator="isModerator"
        :initial-channel.sync="channel"
      />
      <pm-panel v-else :initial-channel.sync="channel" />
    </div>
    <div class="col-md-8 order-md-1">
      <message-compose
        v-if="canPost"
        v-model="message"
        :channel="channel"
        @submit="() => $refs.list.refresh()"
      />
      <div class="card">
        <div class="card-body">
          <message-list
            ref="list"
            :data="data"
            :option="options"
            :is-moderator="isModerator"
            :channel-type="channel.type"
            :last-read-message-id="data.meta.marker && data.meta.marker.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MessageList from '~/components/MessageList.vue'
import MessageCompose from '~/components/MessageCompose.vue'
import ChatPanel from '~/components/ChatPanel.vue'
import PmPanel from '~/components/PmPanel.vue'
import markAsRead from '~/assets/ts/mark-as-read'
import { getRSSLink, deletedUser, findChatValueRaw } from '~/assets/ts/util'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'
import { Channel } from '~/models/channel'
import { User } from '~/models/user'

export default Vue.extend({
  components: {
    MessageList,
    MessageCompose,
    ChatPanel,
    PmPanel
  },
  mixins: [markAsRead],
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  data() {
    return {
      message: '',
      // TODO
      channel: null as Channel | null
    }
  },
  computed: {
    chat(): ChatRoomSettings.Value | void {
      if (!this.channel) return
      return findChatValueRaw(this.channel)
    },
    user(): User | void {
      return this.$store.state.user
    },
    isModerator(): boolean {
      return (
        !!this.user &&
        !!this.channel &&
        ((this.channel.owner && this.user.id === this.channel.owner.id) ||
          !!this.channel.acl.full.user_ids.find(u => u.id === this.user.id))
      )
    },
    isPM(): boolean {
      if (!this.channel) return false
      return this.channel.type === 'io.pnut.core.pm'
    },
    canPost(): boolean {
      if (!this.channel) return false
      return !!this.user && this.channel.acl.write.you
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
  async asyncData({ app: { $axios, $resource }, params, error }) {
    const options = {
      include_deleted: 1
    }
    const messagesPromise = $resource({ options })
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
      channel.owner = {
        ...deletedUser,
        ...channel.owner
      }
      return {
        data,
        channel,
        options
      }
    } catch (e) {
      const { code, error_message } = e.response.data.meta
      return error({
        statusCode: code,
        message: error_message
      })
    }
  },
  mounted() {
    setTimeout(() => this.markAsRead(), 1000)
  },
  head() {
    if (this.channel && !this.channel.acl.read.public) return {}
    const link = [
      getRSSLink(
        `https://api.pnut.io/v0/feed/rss/channels/${this.channel.id}/messages`
      )
    ]
    return {
      link
    }
  }
})
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';
.card {
  @include no-gutter-xs;
}
</style>
