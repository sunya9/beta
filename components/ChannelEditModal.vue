<template>
  <div id="channel-edit-modal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            Edit room info
          </h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <template v-if="vm">
            <div class="form-group">
              <div class="form-group">
                <h5>Name</h5>
                <input type="text" v-model="chat.name" placeholder="Name" class="form-control"
                  maxlength="128"
                  title="Up to 128 characters"
                >
              </div>
              <div class="form-group">
                <h5>Description</h5>
                <textarea class="form-control" v-model="chat.description" placeholder="Room Description" maxlength="128">
                </textarea>
              </div>
              <div class="form-group">
                <h5>Categories</h5>
                <select class="form-control" v-model="chat.categories" multiple>
                  <template v-for="i in ['general','fun','lifestyle','profession','language','community','tech','event']">
                    <option :key="i">{{i}}</option>
                  </template>
                </select>
              </div>
            </div>
          </template>
        </div>
        <div class="modal-footer">
          <button type="button" tabindex="1" class="btn btn-secondary" data-dismiss="modal" ref="cancelButton">Cancel</button>
          <button
            class="btn btn-primary"
            @click="ok"
            tabindex="2"
            data-dismiss="modal">Update</button>
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
  },
  computed: {
    chat() {
      const found = this.channel.raw.find(r => {
        return r.type === 'io.pnut.core.chat-settings'
      }).value
      if (!found.categories) {
        found.categories = []
      }
      return found
    },
    reachedCategoryMax() {
      return this.chat.categories.length >= 3
    }
  }
}
</script>
