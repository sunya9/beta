<template>
  <base-modal
    id="post-modal"
    v-slot="{ ok }"
    :title="title"
    hide-footer
    @show="show"
    @shown="shown"
    @hidden="hidden"
  >
    <div>
      <post v-if="reply && !edit" :post="reply" class="my-3" view-only />
      <compose
        ref="compose"
        :reply-target="reply"
        :edit-post="edit ? reply : null"
        compact
        @post="ok"
      />
    </div>
  </base-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import PostView from '~/components/Post.vue'
import Compose from '~/components/Compose.vue'
import BaseModal from '~/components/BaseModal.vue'
import { Post } from '~/models/post'

@Component({
  components: {
    Post: PostView,
    Compose,
    BaseModal,
  },
})
export default class extends Vue {
  reply: Post | null = null
  key = Date.now()
  edit = false
  get title(): string {
    // TODO
    return this.edit && this.reply && this.reply.user
      ? 'Edit post'
      : this.reply && this.reply.user
      ? `Reply to @${this.reply.user.username}`
      : 'Compose new post'
  }

  $refs!: {
    compose: Compose
  }

  hidden() {
    this.$refs.compose.reset()
    this.reply = null
    this.edit = false
  }

  show(post: Post, options: { edit?: boolean } = {}) {
    this.edit = options.edit || false
    this.reply = post
  }

  shown() {
    this.$refs.compose.setFocus(true)
  }
}
</script>
