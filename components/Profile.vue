<template>
  <div class="card">
    <img :src="profile.content.cover_image.link" alt="" class="card-img-top">
    <div class="card-block">
      <div class="media negative">
        <a :href="profile.content.avatar_image.link">
          <img :src="profile.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="96" height="96" :title="profile.id">
        </a>
        <div class="media-body mt-5">
          <h3 class="card-title mt-2" :title="profile.id">
          @{{profile.username}}
          <small class="text-muted">{{profile.name}}</small>
          </h3>
          <h6 class="card-subtitle text-muted my-2">{{profile.counts.posts}} Posts</h6>
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
export default {
  props: ['profile']
}
</script>

<style scoped>
.negative {
  margin-top: -4rem;
}
.card-img-top {
  max-height: 180px;
}
</style>