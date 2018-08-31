<template>
  <div>
    <h3
      v-show="title"
      class="mt-1">{{ title }}</h3>
    <div class="my-4">
      <compose />
    </div>
    <post
      v-for="post in stream"
      :post="post"
      :key="post.id" />
    <ul class="list-group my-4"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Compose from '~/components/Compose.vue'
// import List from '~/components/List.vue'
import Post from '~/components/Post.vue'

export default {
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
  computed: mapGetters(['user'])
}
</script>
