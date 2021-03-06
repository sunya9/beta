<template>
  <channel-panel :channel.sync="channel">
    <template slot="title">
      <emojify :text="chat.name" />
      <button
        v-if="isModerator"
        class="btn btn-link mr-2"
        type="button"
        @click="channelEditModal"
      >
        <font-awesome-icon :icon="['far', 'edit']" class="mr-2" />
        <span class="d-none d-sm-inline">Edit</span>
      </button>
    </template>
    <p class="text-muted">
      {{ chat.description }}
    </p>
    <ul v-if="chat.categories" class="list-inline">
      <li v-for="i in chat.categories" :key="i" class="list-inline-item">
        <span class="badge badge-secondary">
          {{ upperFirst(i) }}
        </span>
      </li>
    </ul>
    <p v-if="channel.acl.read.public">
      <a
        :href="`https://api.pnut.io/v0/feed/rss/channels/${channel.id}/messages`"
      >
        <font-awesome-icon icon="rss-square" size="lg" />
        RSS
      </a>
    </p>
    <template slot="memberTitle">
      <template v-if="channel.acl.read.public">
        <font-awesome-icon icon="globe" />
        Public
      </template>
      <template v-else>Members</template>
      <button
        v-if="isModerator"
        class="btn btn-link mr-2"
        type="button"
        @click.stop.prevent="memberEditModal"
      >
        <font-awesome-icon :icon="['far', 'edit']" />
        <span class="d-none d-sm-inline ml-2">Edit</span>
      </button>
    </template>
    <template slot="memberList">
      <channel-user-list :owner="channel.owner" kind="owner" />
      <channel-user-list :users="channel.acl.full.user_ids" kind="full" />
      <channel-user-list
        v-if="!channel.acl.write.any_user"
        :users="channel.acl.write.user_ids"
        kind="write"
      />
      <channel-user-list
        v-if="!channel.acl.read.any_user"
        :users="channel.acl.read.user_ids"
        kind="read"
      />
    </template>
  </channel-panel>
</template>
<script lang="ts">
import { upperFirst } from 'lodash'
import { Component, Prop } from 'vue-property-decorator'
import ChannelPanel from '~/components/organisms/ChannelPanel.vue'
import { BaseChannelPanel } from '~/components/molecules/BaseChannelPanel'
import ChannelUserList from '~/components/organisms/ChannelUserList.vue'
import { ChatRoomSettings } from '~/entity/raw/raw/chat-room-settings'
import { Channel } from '~/entity/channel'

@Component({
  components: {
    ChannelPanel,
    ChannelUserList,
  },
  head(this: ChatPanel) {
    return {
      title: this.chat.name,
    }
  },
})
export default class ChatPanel extends BaseChannelPanel {
  @Prop({
    type: Object,
    required: true,
  })
  chat!: ChatRoomSettings.Value

  @Prop({
    type: Boolean,
    default: false,
  })
  isModerator!: boolean

  upperFirst = upperFirst
  async memberEditModal() {
    const acl = await this.$modal.show<Channel.Acl>(
      'channel-member-edit-modal',
      this.channel
    )
    if (!acl) return
    this.update({
      acl,
    })
  }

  async channelEditModal() {
    if (!this.channel || !this.channel.raw) return
    const chatRawValue = await this.$modal.show<ChatRoomSettings.Value>(
      'channel-edit-modal',
      this.channel
    )
    if (!chatRawValue) return
    const chatRawIndex = this.channel.raw.findIndex(
      (r) => r.type === 'io.pnut.core.chat-settings'
    )
    if (chatRawIndex < 0) return
    if (!!chatRawValue.categories && !chatRawValue.categories.length)
      delete chatRawValue.categories
    const chatRaw = {
      type: 'io.pnut.core.chat-settings',
      value: chatRawValue,
    } as const
    const raw = [...this.channel.raw]
    raw.splice(chatRawIndex, 1, chatRaw)
    this.$set(this.channel.raw, chatRawIndex, chatRaw)
    this.update({
      raw,
    })
  }

  async update(channel: Partial<Channel>) {
    try {
      const { data: response } = await this.$axios.$patch(
        `/channels/${this.channel.id}?include_channel_raw=1&include_limited_users=1`,
        channel
      )
      this.$toast.success('Updated!')
      this.channel = response
    } catch (e) {
      this.$toast.error(e.message)
    }
  }
}
</script>
