<template>
  <file-view :file="file" />
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { File } from '../../models/file'
import FileView from '~/components/organisms/FileView.vue'

@Component({
  components: { FileView },
  async asyncData({
    app: { $interactors },
    route: {
      params: { id },
    },
  }) {
    const res = await $interactors.getFile.run({ id })
    return {
      file: res.res.data,
    }
  },
})
export default class ShowFile extends Vue {
  file!: File
}
</script>
