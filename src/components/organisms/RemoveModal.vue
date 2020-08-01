x
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
import { Component } from 'vue-property-decorator'
import PostView from '~/components/organisms/Post.vue'
import BaseModal from '~/components/molecules/BaseModal.vue'
import { Post } from '~/models/post'

@Component({
  components: {
    Post: PostView,
    BaseModal,
  },
})
export default class RemoveModal extends Vue {
  post: Post | null = null
  show(post: Post) {
    this.post = post
  }

  hidden() {
    this.post = null
  }
}
</script>
