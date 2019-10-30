<template>
  <base-modal
    id="channel-edit-modal"
    :ok-disabled="calcDisabled"
    :ok-cb="ok"
    form="channel-edit-form"
    title="Edit room info"
    suppress-warnings
    ok-text="Update"
    @show="show"
  >
    <form
      v-if="chat"
      id="channel-edit-form"
      class="form-group"
      @submit.prevent="ok"
    >
      <div class="form-group">
        <h5>Name</h5>
        <input
          ref="nameInput"
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
          maxlength="256"
        />
      </div>
      <div class="form-group">
        <h5>Categories</h5>
        <select v-model="chat.categories" class="form-control" multiple>
          <template>
            <option v-for="category in $options.categories" :key="category">
              {{ category }}
            </option>
          </template>
        </select>
      </div>
    </form>
  </base-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import BaseModal from '~/components/BaseModal'
import { findChatRaw } from '~/assets/js/util'

export default {
  name: 'ChannelEditModal',
  categories: [
    'general',
    'fun',
    'lifestyle',
    'profession',
    'language',
    'community',
    'tech',
    'event'
  ],
  components: {
    BaseModal
  },
  data() {
    return {
      chat: null
    }
  },
  computed: {
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
    shown() {
      this.$refs.nameInput.focus()
    },
    show(channel) {
      const chatRaw = findChatRaw(channel)
      if (!chatRaw) return
      const chat = chatRaw.value
      if (!chat) if (!chat.categories) chat.categories = []
      this.chat = cloneDeep(chat)
    },
    ok() {
      return this.chat
    },
    hidden() {
      this.chat = null
    }
  }
}
</script>
