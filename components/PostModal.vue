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
      <ul
        v-if="reply"
        class="list-group"
      >
        <post
          :post="reply"
          view-only
          class="post px-0" />
      </ul>
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

<style scoped>
.post {
  border: none;
  background: transparent;
}
</style>
