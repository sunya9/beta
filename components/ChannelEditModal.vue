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
            <option v-for="category in categories" :key="category">
              {{ category }}
            </option>
          </template>
        </select>
      </div>
    </form>
  </base-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { cloneDeep } from 'lodash'
import { Channel } from '../models/channel'
import BaseModal from '~/components/BaseModal.vue'
import { findChatRaw } from '~/assets/ts/util'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'

export default Vue.extend({
  name: 'ChannelEditModal',
  components: {
    BaseModal
  },
  data() {
    return {
      chat: null as ChatRoomSettings.Value | null,
      categories: [
        'general',
        'fun',
        'lifestyle',
        'profession',
        'language',
        'community',
        'tech',
        'event'
      ]
    }
  },
  computed: {
    calcDisabled(): boolean {
      return (
        !this.chat ||
        this.chat.name.length === 0 ||
        this.chat.name.length > 128 ||
        (!!this.chat.description && this.chat.description.length > 256) ||
        (!!this.chat.categories && this.chat.categories.length > 3)
      )
    }
  },
  methods: {
    shown() {
      // TODO
      ;(this.$refs.nameInput as HTMLInputElement).focus()
    },
    show(channel: Channel) {
      const chatRaw = findChatRaw(channel)
      if (!chatRaw) return
      const chat = chatRaw.value
      if (!chat || !chat.categories) chat.categories = []
      this.chat = cloneDeep(chat)
    },
    ok() {
      return this.chat
    },
    hidden() {
      this.chat = null
    }
  }
})
</script>
