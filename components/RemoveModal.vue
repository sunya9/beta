<template>
  <base-modal
    id="remove-modal"
    title="Remove post?"
    auto-focus="cancel"
    @show="show"
    @hidden="hidden"
  >
    <p>Do you want to remove this post?</p>
    <ul
      v-if="post"
      class="list-group"
    >
      <post
        :post="post"
        view-only />
    </ul>
  </base-modal>
</template>

<script>
import Post from '~/components/Post'
import BaseModal from '~/components/BaseModal'

export default {
  components: {
    Post,
    BaseModal
  },
  data() {
    return {
      post: null
    }
  },
  methods: {
    show(post) {
      this.post = post
    },
    hidden() {
      this.post = null
    }
  }
}
</script>
