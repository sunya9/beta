<template>
  <base-modal
    id="message-remove-modal"
    :ok-cb="ok"
    title="Remove message?"
    auto-focus="cancel"
    suppress-warnings
    @show="show"
    @hidden="hidden"
  >
    <p>Do you want to remove this message?</p>
    <ul class="list-unstyled">
      <message
        v-if="vm"
        :message="vm.message"
        :display-full-view="true"
        view-only
      />
    </ul>
  </base-modal>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import Message from '~/components/Message.vue'
import BaseModal from '~/components/BaseModal.vue'

interface VM {
  remove: () => void
}
@Component({
  components: {
    BaseModal,
    Message,
  },
})
export default class extends Vue {
  vm: VM | null = null
  show(vm: VM) {
    this.vm = vm
  }

  ok() {
    if (!this.vm) return
    this.vm.remove()
  }

  hidden() {
    this.vm = null
  }
}
</script>
