<template>
  <div
    :key="$route.fullPath"
    class="row">
    <div class="col-md-4 order-md-2">
      <chat-panel
        v-if="chat"
        :chat="chat"
        :is-moderator="isModerator"
        :initial-channel.sync="channel"
      />
      <pm-panel
        v-else
        :initial-channel.sync="channel" />
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
            :option="option"
            :is-moderator="isModerator"
            :channel-type="channel.type"
            :last-read-message-id="data.meta.marker && data.meta.marker.id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageList from '~/components/MessageList'
import MessageCompose from '~/components/MessageCompose'
import { mapGetters } from 'vuex'
import ChatPanel from '~/components/ChatPanel'
import PmPanel from '~/components/PmPanel'
import markAsRead from '~/assets/js/mark-as-read'
import { getRSSLink, findChatRaw, deletedUser } from '~/assets/js/util'

export default {
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  components: {
    MessageList,
    MessageCompose,
    ChatPanel,
    PmPanel
  },
  mixins: [markAsRead],
  data() {
    return {
      message: ''
    }
  },
  async asyncData({ app: { $axios, $resource }, params, error }) {
    const option = {
      include_deleted: 1
    }
    const messagesPromise = $resource(option)
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
        option
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
    chat() {
      return findChatRaw(this.channel, true)
    },
    ...mapGetters(['user']),
    isModerator() {
      return (
        this.user &&
        this.channel.owner &&
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
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';
.card {
  @include no-gutter-xs;
}
</style>
