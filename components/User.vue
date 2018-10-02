<template>
  <div class="media w-100">
    <nuxt-link :to="`/@${user.username}`">
      <avatar
        :avatar="user.content.avatar_image"
        :max-size="64"
        :size="64"
        class="d-flex mr-3" />
    </nuxt-link>
    <div class="media-body">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="d-inline-flex flex-wrap flex-row">
          <nuxt-link :to="`/@${user.username}`">
            {{ user.username }}
          </nuxt-link>
          <emojify
            :text="user.name"
            class="ml-1 text-muted"
          />
          <span
            v-if="!myself"
            data-test-id="relation"
            class="ml-1 badge badge-secondary text-uppercase"
          >{{ relation }}</span>
        </h6>
        <div>
          <follow-button
            v-if="!disableFollowButton && !myself"
            :profile.sync="internalUser"
            data-test-id="follow-button" />
          <mute-button
            v-if="showUnmuteButton"
            :profile.sync="internalUser"
            class="h5 mb-0" />
        </div>
      </div>
      <p v-if="user.content">
        <entity-text :content="user.content" />
      </p>
    </div>
  </div>
</template>

<script>
import FollowButton from '~/components/FollowButton'
import Avatar from '~/components/Avatar'
import EntityText from '~/components/EntityText'
import MuteButton from '~/components/MuteButton'
import { mapGetters } from 'vuex'

export default {
  components: {
    FollowButton,
    Avatar,
    EntityText,
    MuteButton
  },
  props: {
    user: {
      type: Object,
      required: true
    },
    disableFollowButton: {
      type: Boolean,
      default: false
    },
    showUnmuteButton: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      internalUser: this.user
    }
  },
  computed: {
    relation() {
      return this.user.follows_you ? 'Follows you' : ''
    },
    ...mapGetters({
      me: 'user'
    }),
    myself() {
      return this.me && this.user && this.user.id === this.me.id
    }
  }
}
</script>

<style scoped>
.media-body {
  word-break: break-word;
}
</style>
