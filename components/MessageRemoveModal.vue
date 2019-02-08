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

<script>
import Message from '~/components/Message'
import BaseModal from '~/components/BaseModal'

export default {
  components: {
    BaseModal,
    Message
  },
  data() {
    return {
      vm: null
    }
  },
  methods: {
    show(vm) {
      this.vm = vm
    },
    ok() {
      this.vm.remove()
    },
    hidden() {
      this.vm = null
    }
  }
}
</script>
