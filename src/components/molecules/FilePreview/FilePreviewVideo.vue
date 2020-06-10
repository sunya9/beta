<template>
  <div v-b-modal="videoModalId" class="position-relative">
    <template v-if="videoThumbURL">
      <thumbnail-image :src="videoThumbURL" alt="" />
      <div class="play">
        <div class="play-inner">
          <font-awesome-icon :icon="['far', 'play-circle']" size="2x" />
        </div>
      </div>
    </template>

    <div v-else class="p-3">
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
    <b-modal :id="videoModalId" size="lg" hide-footer>
      <video class="video" autoplay controls>
        <source :src="objectUrl" />
      </video>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import { FilePreviewAbstract } from './FilePreviewAbstract'
import { getVideoThumbURL } from '~/assets/ts/util'
import ThumbnailImage from '~/components/atoms/ThumbnailImage.vue'

@Component({
  components: { ThumbnailImage },
})
export default class FilePreviewVideo extends FilePreviewAbstract {
  videoThumbURL = ''

  mounted() {
    this.getVideoThumb()
  }

  async getVideoThumb() {
    this.videoThumbURL = await getVideoThumbURL(this.objectUrl)
  }

  beforeDestroy() {
    this.revokeObjectURL()
  }

  revokeObjectURL() {
    if (!this.videoThumbURL) return
    URL.revokeObjectURL(this.videoThumbURL)
    this.videoThumbURL = ''
  }

  get videoModalId() {
    return `modal-${this.$_uid}`
  }
}
</script>
<style scoped>
.video {
  width: 100%;
  max-height: 50vh;
}
.play {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-inner {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  padding: 1px;
  display: inline-block;
}
</style>
