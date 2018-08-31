<template>
  <div
    id="remove-modal"
    class="modal fade"
    role="dialog"
    tabindex="-1"
    aria-hidden="true">
    <div
      class="modal-dialog"
      role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Remove message?
          </h5>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Do you want to remove this message?</p>
          <ul class="list-unstyled">
            <message
              v-if="vm"
              :data="vm.message"
              :display-full-view="true"
              view-only />
          </ul>
        </div>
        <div class="modal-footer">
          <button
            ref="cancelButton"
            type="button"
            tabindex="1"
            class="btn btn-secondary"
            data-dismiss="modal">Cancel</button>
          <button
            class="btn btn-primary"
            tabindex="2"
            data-dismiss="modal"
            @click="ok">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '~/assets/js/bus'
import $ from 'jquery'
import Message from '~/components/Message'
import Mousetrap from '~/plugins/mousetrap'

export default {
  components: {
    Message
  },
  data() {
    return {
      vm: null
    }
  },
  mounted() {
    bus.$on('showMessageRemoveModal', this.showModal)
    $(this.$el).on('hidden.bs.modal', this.hidden)
    $(this.$el).on('shown.bs.modal', this.shown)
  },
  beforeDestroy() {
    bus.$off('showMessageRemoveModal', this.showModal)
  },
  methods: {
    showModal(messageVM) {
      if (!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        $(this.$el).modal('show')
        this.vm = messageVM
      }
    },
    ok() {
      this.vm.remove()
    },
    shown() {
      this.$refs.cancelButton.focus()
    },
    hidden() {
      Mousetrap.unpause()
      this.vm = null
    },
    dismiss() {
      if ($(this.$el).hasClass('show')) {
        $(this.$el).modal('hide')
      }
    }
  }
}
</script>
