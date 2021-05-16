<template>
  <button
    v-if="storage.available"
    type="button"
    class="btn btn-link text-dark mb-0"
    @click="() => $refs.file.click()"
  >
    <font-awesome-icon :icon="['far', 'image']" />
    <label class="d-none d-lg-inline ml-2 pointer" :for="id" @click.prevent>
      File
    </label>
    <input
      :id="id"
      ref="file"
      type="file"
      multiple
      accept="image/*,video/*,audio/*"
      style="display: none"
      @change="fileChange"
    />
  </button>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { FileWrapper } from '~/components/organisms/ComposeAbstract'
import { Token } from '~/entity/token'

@Component({})
export default class AddFile extends Vue {
  @Prop({ type: Array, required: false, default: true })
  value!: FileWrapper[]

  $refs!: {
    file: HTMLInputElement
  }

  get id() {
    return `add-file-${this.$_uid}`
  }

  get storage(): Token.Storage {
    return this.$accessor.storage
  }

  fileChange(e: Event) {
    const { target } = e
    if (!(target instanceof HTMLInputElement) || !target.files?.length) return
    const newFileWrappers: FileWrapper[] = Array.from(target.files).map(
      (file, i) => ({ file, id: `${new Date().getTime()}-${i}` })
    )
    const fileWrappers = this.value.concat(newFileWrappers)
    this.$emit('input', fileWrappers)
    // reset file form for detecting changes(if there `sn't below code, not working when is selected same file)
    this.$refs.file.value = ''
  }
}
</script>
