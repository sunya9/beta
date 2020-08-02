<template>
  <div class="media">
    <user-popper v-if="is_pm" :user="recentMessageUser">
      <avatar
        :avatar="recentMessageUserAvatar"
        :enable-placeholder="!recentMessageUser"
        size="32"
        class="mr-2"
      />
    </user-popper>
    <div class="media-body" style="overflow: hidden;">
      <h5>
        <font-awesome-icon
          v-show="channel.you_muted"
          :icon="['far', 'bell-slash']"
          style="float: right;"
        />
        <template v-if="is_pm">
          {{ members }}
        </template>
        <template v-else>
          <font-awesome-icon
            v-if="channel.acl.read.public"
            icon="globe"
            fixed-width
            aria-hidden="true"
          />
          <font-awesome-icon
            v-else
            icon="users"
            fixed-width
            aria-hidden="true"
          />
          <emojify :text="chat && chat.name" />
          <small v-if="chat" class="text-muted">
            <emojify :text="chat.description" />
          </small>
        </template>
      </h5>
      <p v-if="channel.recent_message" class="mb-0 text-truncate">
        <span v-if="!channel.recent_message.is_deleted && spoiler && !me">
          <emojify :text="spoiler.topic" />
        </span>
        <span
          v-else-if="
            channel.recent_message.user && channel.recent_message.content
          "
        >
          @{{ channel.recent_message.user.username }}:
          <emojify :text="channel.recent_message.content.text" />
        </span>
        <span v-else class="text-muted">[Message deleted]</span>
      </p>
    </div>
    <span
      :class="{ 'unread-channel-arrow': channel.has_unread }"
      class="align-self-center"
    >
      <font-awesome-icon icon="chevron-right" />
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import Avatar from '~/components/atoms/Avatar.vue'
import UserPopper from '~/components/molecules/UserPopper.vue'
import { getSpoiler, findChatValueRaw } from '~/assets/ts/util'
import { Channel } from '~/entity/channel'
import { Spoiler } from '~/entity/raw/raw/spoiler'
import { ChatRoomSettings } from '~/entity/raw/raw/chat-room-settings'
import { userIdsIsString } from '~/util/channel'

function isSimpleUser(
  user: Channel.SimpleUser | string
): user is Channel.SimpleUser {
  return typeof user !== 'string'
}

function getOwnerObjFromChannel(channel: Channel): Channel.SimpleUser | null {
  if (
    !channel.owner ||
    !channel.owner.content ||
    !channel.owner.content.avatar_image
  )
    return null
  const {
    username,
    name,
    id,
    content: {
      avatar_image: { link: avatar_image },
    },
  } = channel.owner
  return {
    username,
    name,
    id,
    avatar_image,
  }
}

@Component({
  components: {
    Avatar,
    UserPopper,
  },
})
export default class ChannelView extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  channel!: Channel

  recentMessageUser =
    this.channel.recent_message && this.channel.recent_message.user
      ? this.channel.recent_message.user
      : null

  get members(): string {
    // don't include self or most recent messager
    const owner = getOwnerObjFromChannel(this.channel)
    const userIds = this.channel.acl.write.user_ids
    if (userIdsIsString(userIds)) return ''
    const users = userIds.filter(isSimpleUser)
    const members = [owner, ...users]
    return members
      .map((member) => (member ? `@${member.username}` : 'Deleted user'))
      .join(', ')
  }

  get recentMessageUserAvatar() {
    return this.recentMessageUser?.content?.avatar_image
  }

  get spoiler(): Spoiler.Value | void {
    return getSpoiler(this.channel.recent_message)
  }

  get is_pm(): boolean {
    return this.channel.type === 'io.pnut.core.pm'
  }

  get chat(): ChatRoomSettings.Value | void {
    return findChatValueRaw(this.channel)
  }

  goToChannel() {
    this.$router.push(`/channels/${this.channel.id}`)
  }

  get hasRecentMessage(): boolean {
    return (
      !this.channel.recent_message?.is_deleted &&
      !!this.channel.recent_message?.user &&
      !!this.channel.recent_message?.content
    )
  }
}
</script>
