<template>
  <div v-show="hasAnyPreview" class="img-thumbnail d-flex align-items-center">
    <button class="remove" type="button" @click="remove">
      <font-awesome-icon icon="times" />
    </button>
    <div class="thumbnail">
      <template v-if="objectURL">
        <file-preview-image v-if="isImage" :object-url="objectURL" />
        <file-preview-video v-else-if="isVideo" :object-url="objectURL" />
        <file-preview-audio v-else-if="isAudio" :object-url="objectURL" />
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import FilePreviewImage from './FilePreviewImage.vue'
import FilePreviewVideo from './FilePreviewVideo.vue'
import FilePreviewAudio from './FilePreviewAudio.vue'

@Component({
  components: {
    FilePreviewImage,
    FilePreviewVideo,
    FilePreviewAudio,
  },
})
export default class FilePreview extends Vue {
  @Prop({ type: File, required: true })
  file!: File

  get type() {
    return this.file.type.split('/')[0]
  }

  get isImage() {
    return this.type === 'image'
  }

  get isAudio() {
    return this.type === 'audio'
  }

  get isVideo() {
    return this.type === 'video'
  }

  get hasAnyPreview() {
    return !!this.objectURL
  }

  objectURL: string = ''

  mounted() {
    this.readFile()
  }

  readFile() {
    this.objectURL = URL.createObjectURL(this.file)
  }

  remove() {
    this.$emit('remove')
  }

  beforeDestroy() {
    this.revokeObjectURL()
  }

  revokeObjectURL() {
    if (!this.objectURL) return
    URL.revokeObjectURL(this.objectURL)
  }
}
</script>
<style scoped>
.img-thumbnail {
  position: relative;
}
.remove {
  border: 1px solid #ccc;
  background: white;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 10;
}
</style>
