<template>
  <channel-layout :is-pm="isPM">
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
              :list-info="listInfo"
              :refresh-date="date"
              :is-moderator="isModerator"
              :channel-type="channel.type"
              :last-read-message-id="markerId"
            />
          </div>
        </div>
      </div>
    </div>
    <channel-edit-modal />
    <channel-member-edit-modal />
    <message-remove-modal />
  </channel-layout>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { userIdIsSimpleUser } from '~/util/channel'
import MessageList from '~/components/MessageList.vue'
import MessageCompose from '~/components/organisms/MessageCompose.vue'
import ChatPanel from '~/components/ChatPanel.vue'
import PmPanel from '~/components/PmPanel.vue'
import { getRSSLink, findChatValueRaw } from '~/assets/ts/util'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'
import { Channel } from '~/models/channel'
import { User } from '~/models/user'
import refreshAfterAdded from '~/assets/ts/refresh-after-added'
import { Message } from '~/models/message'
import { ListInfo } from '~/plugins/domain/util/util'
import ChannelEditModal from '~/components/ChannelEditModal.vue'
import ChannelMemberEditModal from '~/components/ChannelMemberEditModal.vue'
import MessageRemoveModal from '~/components/MessageRemoveModal.vue'
import ChannelLayout from '~/components/layouts/channel.vue'

@Component({
  layout: 'no-sidebar',
  components: {
    MessageList,
    MessageCompose,
    ChatPanel,
    PmPanel,
    ChannelEditModal,
    ChannelMemberEditModal,
    MessageRemoveModal,
    ChannelLayout,
  },
  validate({ params: { channelId } }) {
    return /^\d+$/.test(channelId)
  },
  async asyncData({ app: { $interactors }, params, error }) {
    const { channelId } = params
    const { listInfo, channel } = await $interactors.getMessages.run({
      channelId,
    })
    try {
      return { listInfo, channel, markerId: listInfo.newerMeta.marker?.id }
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
export default class ChannelView extends Mixins(refreshAfterAdded) {
  get rssLink() {
    const id = this.channel.id
    return getRSSLink(`https://api.pnut.io/v0/feed/rss/channels/${id}/messages`)
  }

  message = ''
  channel!: Channel
  listInfo!: ListInfo<Message>
  markerId!: string

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
    setTimeout(this.markAsRead, 1000)
  }

  async markAsRead() {
    const { recent_message_id, has_unread, id: channelId } = this.channel
    if (!recent_message_id || !has_unread) return
    await this.$interactors.markAsRead.run({
      type: 'channel',
      channelId,
      id: recent_message_id,
    })
    this.$toast.success('Marked as read!')
    this.$accessor.fetchUnread()
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/mixin';
.card {
  @include no-gutter-xs;
}
</style>
