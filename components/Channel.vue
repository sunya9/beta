<template>
  <nuxt-link :to="`/messages/${channel.id}`">
    <div class="media">
      <avatar :avatar="{ link: opponent.avatar_image }" size="32" class="mr-2" />
      <div class="media-body" style="overflow: hidden">
        <h5>
          <i v-show="channel.you_muted" class="fa fa-bell-slash-o" style="float:right"></i>
          <span v-if="opponent.name">
            {{opponent.name}}
            <small class="text-muted">
              @{{opponent.username}}<span v-if="subscribers.length" class="text-muted">, </span>
            </small>
          </span>
          <span v-else>
            @{{opponent.username}}<small v-if="subscribers.length" class="text-muted">, </small>
          </span>
          <span v-if="subscribers.length" v-for="user in subscribers" :key="user.id" class="text-muted">
            <small><span v-if="user.id !== subscribers[0].id">, </span>@{{user.username}}</small>
          </span>
        </h5>
        <p v-if="channel.recent_message" class="mb-0 text-truncate">
          <span v-if="!channel.recent_message.is_deleted && spoiler">
            {{spoiler.topic}}
          </span>
          <span v-else-if="!channel.recent_message.is_deleted">
            {{channel.recent_message.content.text}}
          </span>
          <span v-else class="text-muted">[Message deleted]</span>
        </p>
      </div>
      <span class="align-self-center">
        <i class="fa fa-chevron-right"></i>
      </span>
    </div>
  </nuxt-link>
</template>

<script>
import Avatar from '~/components/Avatar'
import { mapState } from 'vuex'
import { getSpoiler } from '~/assets/js/util'

export default {
  props: {
    channel: Object
  },
  computed: {
    ...mapState(['user']),
    opponent() {
      if (this.channel.recent_message && this.channel.recent_message.user) {
        const {
          username,
          name,
          id,
          content: {
            avatar_image: { link: avatar_image }
          }
        } = this.channel.recent_message.user
        const res = {
          username,
          name,
          id,
          avatar_image
        }
        return res
      } else if (this.channel.owner.id === this.user.id) {
        return this.channel.acl.write.user_ids[0]
      }

      const {
        username,
        name,
        id,
        content: {
          avatar_image: { link: avatar_image }
        }
      } = this.channel.owner

      const res = {
        username,
        name,
        id,
        avatar_image
      }
      return res
    },
    subscribers() {
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

      const subscribers = this.channel.acl.write.user_ids.filter(user => {
        return (
          user.id !== this.user.id &&
          (!this.channel.recent_message ||
            user.id !== this.channel.recent_message.user.id)
        )
      })

      if (this.channel.owner.id !== this.user.id) {
        subscribers.push(owner)
      }

      return subscribers
    },
    spoiler() {
      return getSpoiler(this.channel.recent_message)
    }
  },
  components: {
    Avatar
  }
}
</script>
