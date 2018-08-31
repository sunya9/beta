<template>
  <div class="row">
    <div class="col-sm-12 col-md-3">
      <h4>Cover</h4>
      <p>Up to 4MiB</p>
    </div>
    <div class="col-sm-12 col-md-9">
      <div class="form-group">
        <img
          ref="cover_image"
          :src="internalCover.link"
          :width="internalCover.width"
          :height="internalCover.height"
          alt="cover image"
          class="img-thumbnail">
      </div>
      <div class="form-group">
        <input
          ref="coverFileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="coverChanged">
        <button
          :disabled="promise"
          type="button"
          class="btn btn-outline-secondary"
          @click="changeCover">
          Change cover
        </button>
      </div>
    </div>
  </div>
</template>
<script>
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
      promise: null,
      internalCover: this.cover
    }
  },
  methods: {
    async coverChanged(e) {
      if (!e.target.files.length) return false
      const [file] = e.target.files
      if (file.size > 4194000) {
        this.$toast.error('Over 4MiB.')
        return
      }
      const fd = new FormData()
      fd.append('cover', file)
      try {
        this.promise = this.$axios
          .$post('/users/me/cover', fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .catch(err => {
            throw new Error(err.response.data.meta.error_message)
          })
        const response = await this.promise
        this.internalCover = response.data.content.cover_image
        this.$toast.success('Changed!')
      } catch (err) {
        this.$toast.error(err.message)
      }
      this.promise = null
    },
    changeCover() {
      this.$refs.coverFileInput.click()
    }
  }
}
</script>
