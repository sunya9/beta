<template>
  <div
    id="channel-edit-modal"
    class="modal fade"
    role="dialog"
    tabindex="-1"
    aria-hidden="true">
    <div
      class="modal-dialog"
      role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            Edit room info
          </h4>
          <button
            type="button"
            class="close"
            data-dismiss="modal"
            aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <template v-if="vm">
            <div class="form-group">
              <div class="form-group">
                <h5>Name</h5>
                <input
                  v-model="chat.name"
                  type="text"
                  placeholder="Name"
                  class="form-control"
                  maxlength="128"
                  title="Up to 128 characters"
                >
              </div>
              <div class="form-group">
                <h5>Description</h5>
                <textarea
                  v-model="chat.description"
                  class="form-control"
                  placeholder="Room description"
                  title="Up to 256 characters"
                  maxlength="256"/>
              </div>
              <div class="form-group">
                <h5>Categories</h5>
                <select
                  v-model="chat.categories"
                  class="form-control"
                  multiple>
                  <template v-for="i in ['general','fun','lifestyle','profession','language','community','tech','event']">
                    <option :key="i">{{ i }}</option>
                  </template>
                </select>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button
            ref="cancelButton"
            type="button"
            tabindex="1"
            class="btn btn-secondary"
            data-dismiss="modal">Cancel</button>
          <button
            :disabled="calcDisabled"
            class="btn btn-primary"
            tabindex="2"
            data-dismiss="modal"
            @click="ok">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '~/assets/js/bus'
import $ from 'jquery'
import Mousetrap from '~/plugins/mousetrap'

export default {
  data() {
    return {
      vm: null,
      channel: null
    }
  },
  computed: {
    chat() {
      if (!this.channel) return false
      const found = this.channel.raw.find(r => {
        return r.type === 'io.pnut.core.chat-settings'
      }).value
      if (!found.categories) {
        found.categories = []
      }
      return found
    },
    calcDisabled() {
      return (
        !this.chat ||
        this.chat.name.length == 0 ||
        this.chat.name.length > 128 ||
        this.chat.description.length > 256 ||
        this.chat.categories.length > 3
      )
    }
  },
  mounted() {
    bus.$on('showChannelEditModal', this.showModal)
    $(this.$el).on('hidden.bs.modal', this.hidden)
    $(this.$el).on('shown.bs.modal', this.shown)
  },
  beforeDestroy() {
    bus.$off('showChannelEditModal', this.showModal)
  },
  methods: {
    showModal(channelVM) {
      if (!$(this.$el).hasClass('show')) {
        Mousetrap.pause()
        $(this.$el).modal('show')
        this.vm = channelVM
        this.channel = JSON.parse(JSON.stringify(this.vm.channel))
      }
    },
    ok() {
      delete this.channel.acl
      const raw = this.channel.raw.filter(r => {
        return r.type !== 'io.pnut.core.chat-settings'
      })
      if (this.chat.categories.length == 0) {
        delete this.chat.categories
      }
      const chatSettings = {
        type: 'io.pnut.core.chat-settings',
        value: this.chat
      }
      raw.push(chatSettings)
      this.channel.raw = raw
      this.vm.update(this.channel)
    },
    shown() {
      this.$refs.cancelButton.focus()
    },
    hidden() {
      Mousetrap.unpause()
      this.vm = null
      this.channel = null
    },
    dismiss() {
      if ($(this.$el).hasClass('show')) {
        $(this.$el).modal('hide')
      }
    }
  }
}
</script>
