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
<script lang="ts">
import Vue from 'vue'
import { User } from '~/models/user'
import BaseModal from '~/components/BaseModal.vue'
import MessageCompose from '~/components/MessageCompose.vue'
export default Vue.extend({
  components: {
    BaseModal,
    MessageCompose
  },
  data() {
    return {
      target: null as User | null
    }
  },
  methods: {
    show({ target }: { target: User }) {
      this.target = target
    },
    shown() {
      const textarea = this.$el.querySelector('textarea')
      if (!textarea) return
      textarea.focus()
    },
    hide() {
      this.target = null
    }
  }
})
</script>
