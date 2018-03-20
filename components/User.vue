<template>
  <li @focus="focus" tabindex="-1" class="list-group-item list-group-item-action">
    <div class="media w-100">
      <nuxt-link :to="`/@${user.username}`">
        <avatar
          :avatar="user.content.avatar_image"
          :max-size="64"
          :size="64"
          class="d-flex mr-3"
        />
      </nuxt-link>
      <div class="media-body">
        <div class="d-flex justify-content-between align-items-baseline mb-2">
          <h6 class="d-inline-flex flex-wrap flex-row">
            <nuxt-link :to="`/@${user.username}`">
              {{user.username}}
            </nuxt-link>
            <span class="ml-1 text-muted">{{user.name}}</span>
            <span class="ml-1 badge badge-secondary text-uppercase">{{relation}}</span>
          </h6>
          <div>
            <follow-button :initial-state="user.you_follow" :user-id="user.id" />
          </div>
        </div>
        <p v-if="user.content">
          <entity-text :content="user.content" />
        </p>
      </div>
    </div>
  </li>
</template>

<script>
import FollowButton from '~/components/FollowButton'
import Avatar from '~/components/Avatar'
import focus from '~/assets/js/focus'
import EntityText from '~/components/EntityText'

export default {
  mixins: [focus],
  props: ['data'],
  computed: {
    relation() {
      return this.data.follows_you ? 'Follows you' : ''
    },
    user() {
      return this.data
    }
  },
  components: {
    FollowButton,
    Avatar,
    EntityText
  }
}
</script>

<style scoped>
.media-body {
  word-break: break-word;
}
</style>
