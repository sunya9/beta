<template>
  <div>
    <h3 v-show="title" class="mt-1">
      {{ title }}
    </h3>
    <div class="my-4">
      <compose />
    </div>
    <post v-for="post in stream" :key="post.id" :post="post" />
    <ul class="list-group my-4" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Compose from '~/components/Compose.vue'
// import List from '~/components/List.vue'
import Post from '~/components/Post.vue'
import { User } from '~/models/user'

export default Vue.extend({
  components: {
    Compose,
    Post
    // List
  },
  props: {
    stream: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    user(): User {
      return this.$store.getters.user
    }
  }
})
</script>
