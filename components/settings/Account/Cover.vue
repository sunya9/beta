<template>
  <div class="row">
    <div class="col-sm-12 col-md-3">
      <h4>Cover</h4>
      <p>Up to 4MiB</p>
    </div>
    <div class="col-sm-12 col-md-9">
      <div class="form-group">
        <img :src="cover.link" ref="cover_image" :width="cover.width" :height="cover.height"
          alt="cover image" class="img-thumbnail">
      </div>
      <div class="form-group">
        <input
          type="file"
          accept="image/*"
          @change="coverChanged"
          style="display: none"
          ref="coverFileInput">
        <button
          type="button"
          @click="changeCover"
          :disabled="promise"
          class="btn btn-secondary">
          Change cover
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import api from '~/plugins/api'

export default {
  props: {
    cover: {
      type: Object,
      required: true,
      validator(obj) {
        return ['is_default', 'height', 'width', 'height'].every(
          key => key in obj
        )
      }
    }
  },
  data() {
    return {
      promise: null
    }
  },
  methods: {
    coverChanged(e) {
      if (!e.target.files.length) return
      const [file] = e.target.files
      if (file.size > 4194000) {
        this.$toast.error('Over 4MiB.')
        return
      }
      const fd = new FormData()
      fd.append('cover', file)
      this.promise = api()
        .post('/proxy/users/me/cover', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Length': file.size
          }
        })
        .then(response => {
          this.$emit('update:cover', response.data.content.cover_image)
          this.$toast.success('Changed!')
        })
        .catch(err => {
          this.$toast.error(err.response.data.meta.error_message)
        })
        .then(() => (this.promise = null))
    },
    changeCover() {
      this.$refs.coverFileInput.click()
    }
  }
}
</script>
