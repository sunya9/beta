<template>
  <base-modal
    id="create-pm-modal"
    ref="modal"
    hide-footer
    suppress-warnings
    title="Send a private message"
    @show="show"
    @shown="shown"
    @hide="hide"
  >
    <message-compose
      :target-user="target"
      create-channel-mode
      class="border-0 mb-0-only-child"
      @submit="$refs.modal.ok()"
    />
  </base-modal>
</template>
<script>
import BaseModal from '~/components/BaseModal'
import MessageCompose from '~/components/MessageCompose'
export default {
  components: {
    BaseModal,
    MessageCompose
  },
  data() {
    return {
      target: null
    }
  },
  methods: {
    show({ target }) {
      this.target = target
    },
    shown() {
      this.$el.querySelector('textarea').focus()
    },
    hide() {
      this.target = null
    }
  }
}
</script>
