<template>
  <div>
    <div class="d-flex mb-2">
      <button
        :disabled="!isSelected"
        class="ml-auto btn btn-danger"
        @click="showModal"
      >
        <font-awesome-icon icon="trash" />
        Delete
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th />
            <th>name</th>
            <th>created at</th>
            <th />
          </tr>
        </thead>
        <base-list
          v-slot="{ item, index, updateItem }"
          list-class=""
          :list-info="listInfo"
          v-bind="$attrs"
          list-element="tr"
          tag="tbody"
          v-on="$listeners"
          @select="select = $event"
        >
          <file-row :file="item" @update:file="updateItem(index, $event)" />
        </base-list>
      </table>
    </div>

    <base-modal
      id="delete-file-modal"
      :ok-cb="deleteFiles"
      auto-focus="cancel"
      title="Are you sure?"
      suppress-warnings
    >
      <p>It cannot be undone.</p>
    </base-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Mixins } from 'vue-property-decorator'
import FileRow from '~/components/molecules/FileRow.vue'
import BaseModal from '~/components/molecules/BaseModal.vue'
import BaseList from '~/components/molecules/BaseList.vue'
import { ListInfo } from '~/plugins/domain/util/util'
import { ModifiedFile } from '~/plugins/domain/entity/ModifiedFile'
import keyBinding, { forList } from '~/assets/ts/key-binding'

const keyMap = {
  t: 'toggleSelect',
} as const

@Component({
  components: {
    BaseModal,
    FileRow,
    BaseList,
  },
})
export default class FileList extends Mixins(
  keyBinding(keyMap),
  forList(keyMap, 'tbody')
) {
  @Prop({
    type: Object,
    required: true,
  })
  listInfo!: ListInfo<ModifiedFile>

  get files() {
    return this.listInfo.data
  }

  set files(newFiles) {
    this.listInfo.data = newFiles
  }

  get isSelected(): boolean {
    return this.files.some((file) => file.select)
  }

  get selectedFiles(): ModifiedFile[] {
    return this.files.filter((file) => file.select)
  }

  showModal() {
    this.$modal.show('delete-file-modal')
  }

  async deleteFiles() {
    const deletePromises = this.selectedFiles.map(async (file) => {
      const res = await this.$axios.$delete(`/files/${file.id}`)
      return res
    })
    await Promise.all(deletePromises)
    this.files = this.files.filter((file) => !file.select)
  }
}
</script>
