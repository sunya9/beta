<template>
  <div class="media">
    <avatar
      v-if="is_pm"
      :avatar="channel.recent_message.user.content.avatar_image"
      size="32"
      class="mr-2" />
    <div
      class="media-body"
      style="overflow: hidden">
      <h5>
        <font-awesome-icon
          v-show="channel.you_muted"
          :icon="['far', 'bell-slash']"
          style="float:right" />
        <template v-if="is_pm">
          {{ members }}
        </template>
        <template v-else>
          <font-awesome-icon
            v-if="channel.acl.read.public"
            icon="globe"
            fixed-width
            aria-hidden="true"/>
          <font-awesome-icon
            v-else
            icon="users"
            fixed-width
            aria-hidden="true"/>
          <emojify :text="chat.name" />
          <small class="text-muted">
            {{ chat.description }}
          </small>
        </template>
      </h5>
      <p
        v-if="channel.recent_message"
        class="mb-0 text-truncate">
        <span v-if="!channel.recent_message.is_deleted && spoiler && !me">
          {{ spoiler.topic }}
        </span>
        <span v-else-if="!channel.recent_message.is_deleted">
          @{{ channel.recent_message.user.username }}: {{ channel.recent_message.content.text }}
        </span>
        <span
          v-else
          class="text-muted">[Message deleted]</span>
      </p>
    </div>
    <span
      :class="{'unread-channel-arrow': channel.has_unread}"
      class="align-self-center">
      <font-awesome-icon icon="chevron-right"/>
    </span>
  </div>
</template>

<script>
import Avatar from '~/components/Avatar'
import { getSpoiler, findChatRaw } from '~/assets/js/util'

export default {
  name: 'Channel',
  components: {
    Avatar
  },
  props: {
    channel: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    members() {
      // don't include self or most recent messager
      const {
        username,
        name,
        id,
        content: {
          avatar_image: { link: avatar_image }
        }
      } = this.channel.owner
      const owner = {
        username,
        name,
        id,
        avatar_image
      }

      const members = [owner, ...this.channel.acl.write.user_ids]
      return members.map(member => `@${member.username}`).join(', ')
    },
    spoiler() {
      return getSpoiler(this.channel.recent_message)
    },
    is_pm() {
      return this.channel.type === 'io.pnut.core.pm'
    },
    chat() {
      return findChatRaw(this.channel, true)
    }
  }
}
</script>
