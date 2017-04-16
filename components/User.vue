<template>
  <li class="list-group-item list-group-item-action">
    <div class="media">
      <nuxt-link :to="`/@${user.username}`">
        <img :src="user.content.avatar_image.link"
          alt="" class="d-flex mr-3 rounded-circle"
          width="64" height="64">
      </nuxt-link>
      <div class="media-body">
        <h6 class="mt-1">
          <nuxt-link :to="`/@${user.username}`">
          {{user.username}}
          </nuxt-link>
          <span class="text-muted">{{user.name}}</span>
        </h6>
        <p v-html="html"></p>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: ['user'],
  computed: {
    html() {
      if(this.user.content && this.user.content.html)
      return this.user.content.html
    }
  }
}
</script>