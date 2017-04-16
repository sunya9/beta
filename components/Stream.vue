<template>
  <div>
    <h3 class="mt-1" v-show="title">{{title}}</h3>
    <div class="my-4">
      <compose />
    </div>
    <post :post="post" :key="post.id" v-for="post in stream" />
    <ul class="list-group my-4">
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Compose from '~components/Compose.vue'
// import List from '~components/List.vue'
import Post from '~components/Post.vue'

export default {
  props: ['stream', 'title'],
  computed: mapState([
    'user'
  ]),
  components: {
    Compose,
    Post,
    // List
  }
}
</script>