<template>
  <base-modal
    id="remove-modal"
    title="Remove post?"
    auto-focus="cancel"
    @show="show"
    @hidden="hidden"
  >
    <p>Do you want to remove this post?</p>
    <post v-if="post" :post="post" view-only />
  </base-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import PostView from '~/components/Post.vue'
import BaseModal from '~/components/BaseModal.vue'
import { Post } from '~/models/post'

export default Vue.extend({
  components: {
    Post: PostView,
    BaseModal,
  },
  data() {
    return {
      post: null as Post | null,
    }
  },
  methods: {
    show(post: Post) {
      this.post = post
    },
    hidden() {
      this.post = null
    },
  },
})
</script>
