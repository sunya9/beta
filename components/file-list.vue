<template>
  <div>
    <div class="d-flex mb-2">
      <button class="ml-auto btn btn-danger" @click="showModal" :disabled="!isSelected">
        <i class="fa fa-trash"></i>
        Delete
      </button>
    </div>
    <table class="table table-hover"
      v-infinite-scroll="fetchMore"
      infinite-scroll-disabled="moreDisabled"
      infinite-scroll-distance="100">
      <thead>
        <tr>
          <th></th>
          <th>#</th>
          <th>name</th>
          <th>created at</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <file-row
          v-for="file in modifiedFiles"
          :file="file"
          :key="file.id" />
      </tbody>
    </table>

    <div id="delete-file-modal" class="modal fade" role="dialog" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Are you sure?
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>
              It cannot be undone.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" @click="deleteFiles">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FileRow from '~/components/file-row'
import $ from 'jquery'

export default {
  props: ['data'],
  components: {
    FileRow
  },
  data() {
    return {
      busy: false,
      meta: this.data.meta,
      files: this.data.data,
      modal: null
    }
  },
  mounted() {
    this.modal = $('#delete-file-modal')
  },
  computed: {
    isSelected() {
      return this.modifiedFiles.some(file => file.select)
    },
    selectedFiles() {
      return this.modifiedFiles.filter(file => file.select)
    },
    moreDisabled() {
      return this.busy || !this.meta.more
    },
    modifiedFiles() {
      return this.files.map(file => {
        this.$set(file, 'select', false)
        return file
      })
    }
  },
  methods: {
    async fetchMore() {
      this.busy = true
      const option = Object.assign({}, this.option, {
        before_id: this.meta.min_id
      })
      const { data: newItems, meta } = await this.$resource(option)
      this.meta = meta

      if (newItems.length) {
        this.files = this.files.concat(newItems)
      }
      this.busy = false
    },
    showModal() {
      this.modal.modal('show')
    },
    async deleteFiles() {
      const deletePromises = this.selectedFiles.map(async file => {
        const res = await this.$axios.$delete(`/files/${file.id}`)
        return res
      })
      await Promise.all(deletePromises)
      this.files = this.modifiedFiles.filter(file => !file.select)
    }
  }
}
</script>
