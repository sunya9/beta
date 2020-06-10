<template>
  <div v-show="fileWrappers.length">
    <div class="form-group">
      <transition-group tag="div" name="file" class="d-flex flex-wrap">
        <file-preview
          v-for="(fileWrapper, i) in fileWrappers"
          :key="fileWrapper.id"
          :file="fileWrapper.file"
          class="mr-2"
          @remove="$emit('remove', i)"
        />
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component } from 'vue-property-decorator'

import Vue from 'vue'
import { FileWrapper } from './ComposeAbstract'
import FilePreview from '~/components/molecules/FilePreview/FilePreview.vue'

@Component({
  components: { FilePreview },
  inheritAttrs: false,
})
export default class FilePreviewList extends Vue {
  @Prop({ type: Array, required: true })
  fileWrappers!: FileWrapper[]
}
</script>
<style scoped>
.file-enter-active,
.file-leave-to {
  transition: all 0.5s ease;
}

.file-enter,
.file-leave-to {
  opacity: 0;
  transform: scale(0);
}

.file-move {
  transition: transform 0.5s;
}
</style>
