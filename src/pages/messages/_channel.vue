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
      <message-compose v-if="canPost" v-model="message" :channel="channel" />
      <div class="card">
        <div class="card-body">
          <message-list
            :data="data"
            :option="options"
            :refresh-date="date"
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
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { PnutResponse } from '../../models/pnut-response'
import { userIdIsSimpleUser } from '~/util/channel'
import MessageList from '~/components/MessageList.vue'
import MessageCompose from '~/components/organisms/MessageCompose.vue'
import ChatPanel from '~/components/ChatPanel.vue'
import PmPanel from '~/components/PmPanel.vue'
import markAsRead from '~/assets/ts/mark-as-read'
import { getRSSLink, deletedUser, findChatValueRaw } from '~/assets/ts/util'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'
import { Channel } from '~/models/channel'
import { User } from '~/models/user'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { Message } from '~/models/message'

@Component({
  components: {
    MessageList,
    MessageCompose,
    ChatPanel,
    PmPanel,
  },
  validate({ params: { channel } }) {
    return /^\d+$/.test(channel)
  },
  async asyncData({ app: { $resource }, params, error }) {
    const options = {
      include_deleted: 1,
    }
    const messagesPromise = $resource<Message[]>({ options })
    const channelPromise = $resource<Channel>({
      url: `/channels/${params.channel}`,
      options: {
        include_limited_users: 1,
        include_channel_raw: 1,
      },
    })
    try {
      const [data, { data: channel }] = await Promise.all([
        messagesPromise,
        channelPromise,
      ])
      if (channel.owner?.content) {
        channel.owner = {
          ...deletedUser,
          ...channel.owner,
          content: {
            ...channel.owner.content,
            avatar_image: {
              ...channel.owner.content.avatar_image,
            },
          },
        }
      }
      return {
        data,
        channel,
        options,
      }
    } catch (e) {
      const { code, error_message } = e.response.data.meta
      return error({
        statusCode: code,
        message: error_message,
      })
    }
  },
  head(this: ChannelView) {
    const link = [this.rssLink]
    return {
      link,
    }
  },
})
export default class ChannelView extends Mixins(refreshAfterAdded, markAsRead) {
  get rssLink() {
    const id = this.channel.id
    return getRSSLink(`https://api.pnut.io/v0/feed/rss/channels/${id}/messages`)
  }

  message = ''
  channel!: Channel
  data!: PnutResponse<Message[]>
  options!: object

  get chat(): ChatRoomSettings.Value | void {
    if (!this.channel) return undefined
    return findChatValueRaw(this.channel)
  }

  get user(): User | null {
    return this.$accessor.user
  }

  get isModerator(): boolean {
    return (
      !!this.user &&
      !!this.channel &&
      ((this.channel.owner && this.user.id === this.channel.owner.id) ||
        !!this.channel.acl.full.user_ids
          .filter(userIdIsSimpleUser)
          .find((u) => !!this.user && u.id === this.user.id))
    )
  }

  get isPM(): boolean {
    if (!this.channel) return false
    return this.channel.type === 'io.pnut.core.pm'
  }

  get canPost(): boolean {
    if (!this.channel) return false
    return !!this.user && this.channel.acl.write.you
  }

  @Watch('$route.fullPath', { immediate: true })
  onChangeRouteFullPath() {
    this.$emit('updateNav', this.isPM)
  }

  mounted() {
    setTimeout(() => this.markAsRead(this.channel), 1000)
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';
.card {
  @include no-gutter-xs;
}
</style>
