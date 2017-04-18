<template>
  <div class="card">
    <img :src="profile.content.cover_image.link" alt="" class="img-fluid card-img-top pb-1">
    <div class="card-block">
      <div class="media negative">
        <a :href="profile.content.avatar_image.link">
          <img :src="profile.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="96" height="96" :title="profile.id">
        </a>
        <div class="media-body mt-5">
          <div class="d-flex justify-content-between">
            <div>
              <h3 class="card-title mt-2" :title="profile.id">
              @{{profile.username}}
              <small class="text-muted">{{profile.name}}</small>
              </h3>
              <h6 class="card-subtitle text-muted my-2">{{profile.counts.posts}} Posts</h6>
            </div>
            <div v-if="profile.id !== user.id" class="mt-2">
              <follow-button :initial-state="profile.you_follow" :user-id="profile.id" />
            </div>
          </div>
          <p class="card-text" v-html="profile.content.html"></p>
        </div>
      </div>
    </div>
    <div class="card-block text-right">
      <nuxt-link class="card-link" to="follows" append>{{profile.counts.following}} Follows</nuxt-link>
      <nuxt-link class="card-link" to="followers" append>{{profile.counts.followers}} Followers</nuxt-link>
      <nuxt-link class="card-link" to="starred" append>{{profile.counts.bookmarks}} Starred</nuxt-link>
    </div>
  </div>
</template>

<script>
import FollowButton from '~components/FollowButton'
import { mapState } from 'vuex'

export default {
  props: ['profile'],
  components: {
    FollowButton
  },
  computed: mapState(['user'])
}
</script>

<style scoped>
.negative {
  margin-top: -4rem;
}
</style>