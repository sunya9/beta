<template>
  <div>
    <emoji-button @click.native.prevent.stop="togglePalette" />
    <client-only>
      <picker
        v-show="showEmojiPicker"
        ref="picker"
        v-on-click-outside="closeEmojiPalette"
        :background-image-fn="getSheet"
        set="twitter"
        class="emoji-picker"
        @select="addEmoji"
      />
    </client-only>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import EmojiButton from '~/components/atoms/EmojiButton.vue'
import { Picker, Emoji } from '~/plugins/emoji'

@Component({
  components: { EmojiButton, Picker },
})
export default class EmojiPicker extends Vue {
  showEmojiPicker = false

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

  getSheet() {
    return require('emoji-datasource-twitter/img/twitter/sheets-128/64.png')
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
