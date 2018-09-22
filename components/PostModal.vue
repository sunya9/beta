<template>
  <base-modal
    id="post-modal"
    :title="title"
    suppress-warnings
    hide-footer
    @show="show"
    @shown="shown"
    @hidden="hidden"
  >
    <div
      slot-scope="{ ok }"
    >
      <post
        v-if="reply"
        :post="reply"
        class="my-3"
        view-only
      />
      <compose
        ref="compose"
        :reply-target="reply"
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
      key: Date.now()
    }
  },
  computed: {
    title() {
      return this.reply
        ? `Reply to @${this.reply.user.username}`
        : 'Compose new post'
    }
  },
  methods: {
    hidden() {
      this.$refs.compose.reset()
      this.reply = null
    },
    async show(post) {
      this.reply = post
    },
    shown() {
      this.$refs.compose.setFocus(true)
    }
  }
}
</script>
