<template>
  <nuxt-link
    :to="`/messages/${data.id}`"
    :class="{'unread-channel': data.has_unread}">
    <div class="media">
      <avatar
        v-if="is_pm"
        :avatar="{ link: opponent.avatar_image }"
        size="32"
        class="mr-2" />
      <div
        class="media-body"
        style="overflow: hidden">
        <h5>
          <font-awesome-icon
            v-show="data.you_muted"
            :icon="['far', 'bell-slash']"
            style="float:right"/>
          <template v-if="is_pm">
            <span v-if="opponent.name">
              {{ opponent.name }}
              <small class="text-muted">
                @{{ opponent.username }}<span
                  v-if="members.length"
                  class="text-muted">, </span>
              </small>
            </span>
            <span v-else>
              @{{ opponent.username }}<small
                v-if="members.length"
                class="text-muted">, </small>
            </span>
            <span
              v-if="members.length"
            >
              <span
                v-for="user in members"
                :key="user.id"
                class="text-muted">
                <small><span v-if="user.id !== members[0].id">, </span>@{{ user.username }}</small>
              </span>
            </span>
          </template>
          <template v-else>
            <font-awesome-icon
              v-if="data.acl.read.public"
              icon="globe"
              fixed-width
              aria-hidden="true"/>
            <font-awesome-icon
              v-else
              icon="users"
              fixed-width
              aria-hidden="true"/>
            <span v-emojify>{{ chat.name }}</span>
            <small class="text-muted">
              {{ chat.description }}
            </small>
          </template>
        </h5>
        <p
          v-if="data.recent_message"
          class="mb-0 text-truncate">
          <span v-if="!data.recent_message.is_deleted && spoiler && !me">
            {{ spoiler.topic }}
          </span>
          <span v-else-if="!data.recent_message.is_deleted">
            <span v-if="!is_pm">@{{ opponent.username }}: </span>{{ data.recent_message.content.text }}
          </span>
          <span
            v-else
            class="text-muted">[Message deleted]</span>
        </p>
      </div>
      <span
        :class="{'unread-channel-arrow': data.has_unread}"
        class="align-self-center">
        <font-awesome-icon icon="chevron-right"/>
      </span>
    </div>
  </nuxt-link>
</template>

<script>
import Avatar from '~/components/Avatar'
import { mapGetters } from 'vuex'
import { getSpoiler } from '~/assets/js/util'

export default {
  components: {
    Avatar
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['user']),
    opponent() {
      if (this.data.recent_message && this.data.recent_message.user) {
        const {
          username,
          name,
          id,
          content: {
            avatar_image: { link: avatar_image }
          }
        } = this.data.recent_message.user
        const res = {
          username,
          name,
          id,
          avatar_image
        }
        return res
      } else if (this.data.owner.id === this.user.id) {
        return this.data.acl.write.user_ids[0]
      }

      const {
        username,
        name,
        id,
        content: {
          avatar_image: { link: avatar_image }
        }
      } = this.data.owner

      const res = {
        username,
        name,
        id,
        avatar_image
      }
      return res
    },
    members() {
      // don't include self or most recent messager
      const {
        username,
        name,
        id,
        content: {
          avatar_image: { link: avatar_image }
        }
      } = this.data.owner
      const owner = {
        username,
        name,
        id,
        avatar_image
      }

      const members = this.data.acl.write.user_ids.filter(user => {
        return (
          user.id !== this.user.id &&
          (!this.data.recent_message ||
            user.id !== this.data.recent_message.user.id)
        )
      })

      if (this.data.owner.id !== this.user.id) {
        members.push(owner)
      }

      return members
    },
    spoiler() {
      return getSpoiler(this.data.recent_message)
    },
    is_pm() {
      return this.data.type === 'io.pnut.core.pm'
    },
    chat() {
      return this.data.raw.filter(r => {
        return r.type === 'io.pnut.core.chat-settings'
      })[0].value
    }
  }
}
</script>
