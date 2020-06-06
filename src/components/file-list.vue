<template>
  <div
    v-infinite-scroll="fetchMore"
    infinite-scroll-disabled="moreDisabled"
    infinite-scroll-distance="100"
  >
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
        <tbody>
          <file-row
            v-for="(file, index) in files"
            :key="file.id"
            :file.sync="file"
            @update:file="(newFile) => $set(files, index, newFile)"
          />
        </tbody>
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
import Vue, { PropOptions } from 'vue'
import FileRow from '~/components/molecules/FileRow.vue'
import BaseModal from '~/components/BaseModal.vue'
import { PnutResponse } from '~/models/pnut-response'
import { File } from '~/models/file'

export interface ModifiedFile extends File {
  select: boolean
}

function addSelectField(file: File) {
  const modifiedFile = {
    ...file,
    select: false,
  }
  return modifiedFile
}

export default Vue.extend({
  components: {
    BaseModal,
    FileRow,
  },
  props: {
    data: {
      type: Object,
      required: true,
    } as PropOptions<PnutResponse<File[]>>,
  },
  data() {
    return {
      busy: false,
      meta: this.data.meta,
      files: this.data.data.map(addSelectField),
      modal: null,
    }
  },
  computed: {
    isSelected(): boolean {
      return this.files.some((file) => file.select)
    },
    selectedFiles(): ModifiedFile[] {
      return this.files.filter((file) => file.select)
    },
    moreDisabled(): boolean {
      return this.busy || !this.meta.more
    },
  },
  methods: {
    async fetchMore() {
      this.busy = true
      const options = Object.assign(
        {},
        {
          before_id: this.meta.min_id,
        }
      )
      const { data: newItems, meta } = await this.$resource<File[]>({ options })
      this.meta = meta

      if (newItems.length) {
        this.files = this.files.concat(newItems.map(addSelectField))
      }
      this.busy = false
    },
    showModal() {
      this.$modal.show('delete-file-modal')
    },
    async deleteFiles() {
      const deletePromises = this.selectedFiles.map(async (file) => {
        const res = await this.$axios.$delete(`/files/${file.id}`)
        return res
      })
      await Promise.all(deletePromises)
      this.files = this.files.filter((file) => !file.select)
    },
  },
})
</script>
