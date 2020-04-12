<template>
  <div class="media">
    <avatar
      v-if="is_pm"
      v-bind="{
        avatar:
          recentMessageUser &&
          recentMessageUser.content &&
          recentMessageUser.content.avatar_image,
      }"
      :enable-placeholder="!recentMessageUser"
      size="32"
      class="mr-2"
    />
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
        <span v-else-if="hasRecentMessage">
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
import Vue, { PropOptions } from 'vue'
import Avatar from '~/components/Avatar.vue'
import { getSpoiler, findChatValueRaw } from '~/assets/ts/util'
import { Channel } from '~/models/channel'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { User } from '~/models/user'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'
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
export default Vue.extend({
  name: 'Channel',
  components: {
    Avatar,
  },
  props: {
    channel: {
      type: Object,
      required: true,
    } as PropOptions<Channel>,
  },
  computed: {
    recentMessageUser(): User | null {
      return this.channel.recent_message && this.channel.recent_message.user
        ? this.channel.recent_message.user
        : null
    },
    members(): string {
      // don't include self or most recent messager
      const owner = getOwnerObjFromChannel(this.channel)
      const userIds = this.channel.acl.write.user_ids
      if (userIdsIsString(userIds)) return ''
      const users = userIds.filter(isSimpleUser)
      const members = [owner, ...users]
      return members
        .map((member) => (member ? `@${member.username}` : 'Deleted user'))
        .join(', ')
    },
    spoiler(): Spoiler.Value | void {
      return getSpoiler(this.channel.recent_message)
    },
    is_pm(): boolean {
      return this.channel.type === 'io.pnut.core.pm'
    },
    chat(): ChatRoomSettings.Value | void {
      return findChatValueRaw(this.channel)
    },
    hasRecentMessage(): boolean {
      return (
        !this.channel.recent_message?.is_deleted &&
        !!this.channel.recent_message?.user &&
        !!this.channel.recent_message?.content
      )
    },
  },
})
</script>
