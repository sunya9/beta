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

<script>
import Post from '~/components/Post'
import Compose from '~/components/Compose'
import BaseModal from '~/components/BaseModal'

export default {
  components: {
    Post,
    Compose,
    BaseModal
  },
  data() {
    return {
      reply: null,
      key: Date.now(),
      edit: false
    }
  },
  computed: {
    title() {
      return this.edit
        ? 'Edit post'
        : this.reply
        ? `Reply to @${this.reply.user.username}`
        : 'Compose new post'
    }
  },
  methods: {
    hidden() {
      this.$refs.compose.reset()
      this.reply = null
      this.edit = false
    },
    show(post, options = {}) {
      this.edit = options.edit
      this.reply = post
    },
    shown() {
      this.$refs.compose.setFocus(true)
    }
  }
}
</script>
