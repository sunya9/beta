<template>
  <thumbnail-image :src="objectUrl" alt="" class="image" />
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import mediumZoom from 'medium-zoom'
import { FilePreviewAbstract } from './FilePreviewAbstract'
import ThumbnailImage from '~/components/atoms/ThumbnailImage.vue'

@Component({
  components: { ThumbnailImage },
})
export default class FilePreviewImage extends FilePreviewAbstract {
  mounted() {
    this.setMediumZoom()
  }

  setMediumZoom() {
    if (!(this.$el instanceof HTMLElement)) return
    mediumZoom(this.$el, {
      background: 'rgba(0, 0, 0, .5)',
    })
  }
}
</script>
