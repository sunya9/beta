<template>
  <base-modal
    id="post-modal"
    :title="title"
    hide-footer
    @show="show"
    @shown="shown"
    @hidden="hidden"
  >
    <div slot-scope="{ ok }">
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
import PostView from '~/components/Post.vue'
import Compose from '~/components/Compose.vue'
import BaseModal from '~/components/BaseModal.vue'
import { Post } from '~/models/post'

export default Vue.extend({
  components: {
    Post: PostView,
    Compose,
    BaseModal
  },
  data() {
    return {
      reply: null as Post | null,
      key: Date.now(),
      edit: false
    }
  },
  computed: {
    title(): string {
      // TODO
      return this.edit && this.reply && this.reply.user
        ? 'Edit post'
        : this.reply && this.reply.user
        ? `Reply to @${this.reply.user.username}`
        : 'Compose new post'
    }
  },
  methods: {
    hidden() {
      // TODO
      ;(this.$refs.compose as any).reset()
      this.reply = null
      this.edit = false
    },
    show(post: Post, options: { edit?: boolean } = {}) {
      this.edit = options.edit || false
      this.reply = post
    },
    shown() {
      // TODO
      ;(this.$refs.compose as any).setFocus(true)
    }
  }
})
</script>
