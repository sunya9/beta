<template>
  <div v-b-modal="audioModalId" class="p-3">
    <font-awesome-icon
      :icon="['far', 'file-audio']"
      size="3x"
      class="text-light"
    />
    <b-modal :id="audioModalId" hide-footer>
      <audio autoplay controls class="audio">
        <source :src="objectUrl" />
      </audio>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import { FilePreviewAbstract } from './FilePreviewAbstract'

@Component
export default class FilePreviewAudio extends FilePreviewAbstract {
  get audioModalId() {
    return `modal-${this.$_uid}`
  }
}
</script>
<style scoped>
.audio {
  width: 100%;
}
</style>
