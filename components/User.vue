<template>
  <li class="list-group-item list-group-item-action">
    <div class="media w-100">
      <nuxt-link :to="`/@${user.username}`">
        <img :src="user.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="64" height="64">
      </nuxt-link>
      <div class="media-body">
        <div class="d-flex justify-content-between align-items-baseline">
          <h6 class="mb-1">
            <nuxt-link :to="`/@${user.username}`">
            {{user.username}}
            </nuxt-link>
            <span class="text-muted">{{user.name}}</span>
          </h6>
          <div>
            <follow-button :initial-state="user.you_follow" :user-id="user.id" />
          </div>
        </div>
        <p v-html="html"></p>
      </div>
    </div>
  </li>
</template>

<script>
import FollowButton from '~components/FollowButton'
export default {
  props: ['data'],
  computed: {
    html() {
      if(this.user.content && this.user.content.html)
      return this.user.content.html
    },
    user() {
      return this.data
    }
  },
  components: {
    FollowButton
  }
}
</script>