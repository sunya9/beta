<template>
  <div class="list-group-item list-group-item-action">
    <div class="media">
      <nuxt-link :to="`/@${post.user.username}`">
        <img :src="post.user.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="64" height="64">
      </nuxt-link>
      <div class="media-body">
        <h6 class="mt-1">
          <nuxt-link :to="`/@${post.user.username}`">
          {{post.user.username}}
          </nuxt-link>
          <span class="text-muted">{{post.user.name}}</span>
        </h6>
        <p v-html="html"></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['post'],
  computed: {
    html() {
      if(this.post.content && this.post.content.html)
      return this.post.content.html
    }
  }
}
</script>