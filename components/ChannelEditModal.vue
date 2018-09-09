<template>
  <base-modal
    id="channel-edit-modal"
    :ok-disabled="calcDisabled"
    :ok-cb="ok"
    title="Edit room info"
    auto-focus="cancel"
    suppress-warnings
    ok-text="Update"
    @show="show"
  >
    <div
      v-if="vm"
      class="form-group"
    >
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
  </base-modal>
</template>

<script>
import BaseModal from '~/components/BaseModal'

export default {
  components: {
    BaseModal
  },
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
        this.chat.name.length === 0 ||
        this.chat.name.length > 128 ||
        this.chat.description.length > 256 ||
        this.chat.categories.length > 3
      )
    }
  },
  methods: {
    show(vm) {
      this.vm = vm
      this.channel = JSON.parse(JSON.stringify(this.vm.channel))
    },
    ok() {
      delete this.channel.acl
      const raw = this.channel.raw.filter(r => {
        return r.type !== 'io.pnut.core.chat-settings'
      })
      if (!this.chat.categories.length) {
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
    hidden() {
      this.vm = null
      this.channel = null
    }
  }
}
</script>
