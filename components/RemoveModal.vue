<template>
  <base-modal
    id="remove-modal"
    :ok-cb="ok"
    title="Remove post?"
    suppress-warnings
    auto-focus="cancel"
    @show="show"
    @hidden="hidden"
  >
    <p>Do you want to remove this post?</p>
    <ul
      v-if="vm"
      class="list-group"
    >
      <post
        :data="vm.post"
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
