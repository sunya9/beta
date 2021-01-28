<template>
  <div>
    <emoji-button @click.native.prevent.stop="togglePalette" />
    <client-only>
      <picker
        v-show="showEmojiPicker"
        ref="picker"
        v-on-click-outside="closeEmojiPalette"
        set="twitter"
        :data="emojiIndex"
        class="emoji-picker"
        @select="addEmoji"
      />
    </client-only>
  </div>
</template>

import 'emoji-mart-vue-fast/css/emoji-mart.css'

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import data from 'emoji-mart-vue-fast/data/all.json'
import { Picker, EmojiIndex } from 'emoji-mart-vue-fast'
import EmojiButton from '~/components/atoms/EmojiButton.vue'
import { Emoji } from '~/plugins/emoji'
import 'emoji-mart-vue-fast/css/emoji-mart.css'

@Component({
  components: { EmojiButton, Picker },
})
export default class EmojiPicker extends Vue {
  showEmojiPicker = false
  emojiIndex = new EmojiIndex(data)

  addEmoji(emoji: Emoji) {
    this.$emit('select', emoji.native)
    this.closeEmojiPalette()
  }

  $refs!: {
    picker: Vue
  }

  async togglePalette() {
    this.showEmojiPicker = !this.showEmojiPicker
    if (!this.showEmojiPicker) return
    this.$emit('show')
    const input = this.$refs.picker.$el.querySelector('input')
    if (!input) return
    await this.$nextTick()
    input.focus()
  }

  closeEmojiPalette() {
    this.showEmojiPicker = false
  }
}
</script>
<style scoped>
.emoji-picker {
  position: absolute;
  right: 0;
  top: 2rem;
  z-index: 3;
}
</style>
