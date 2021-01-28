<template>
  <div>
    <div class="card">
      <div class="card-body">
        <file-list :list-info="listInfo" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { ModifiedFile } from '~/plugins/domain/entity/ModifiedFile'
import FileList from '~/components/organisms/file-list.vue'
import { ListInfo } from '~/plugins/domain/util/util'

@Component({
  components: {
    FileList,
  },
  async asyncData({
    app: { $interactors },
    route: {
      query: { kind },
    },
  }) {
    const { listInfo, title } = await $interactors.getFiles.run({ kind })
    return {
      listInfo,
      title,
    }
  },
  head(this: Files) {
    return {
      title: this.title,
    }
  },
  watchQuery: true,
  key: (route) => route.fullPath,
})
export default class Files extends Vue {
  readonly listInfo!: ListInfo<ModifiedFile>
  readonly title!: string
}
</script>
