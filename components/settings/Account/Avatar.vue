<template>
  <div class="row">
    <div class="col-sm-12 col-md-3">
      <h4>Avatar</h4>
      <p>Square, Up to 2MiB</p>
    </div>
    <div class="col-ms-12 col-md-9">
      <div class="form-group">
        <img
          :src="avatar.link" ref="avatar_image" width="128" height="128"
          alt="avatar image">
      </div>
      <div class="form-group">
        <input
          type="file"
          @change="avatarChanged"
          accept="image/*"
          style="display: none"
          ref="avatarFileInput">
        <button
          type="button"
          @click="changeAvatar"
          :disabled="promise"
          class="btn btn-secondary mr-2">
          Change avatar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '~/plugins/api'

export default {
  props: {
    avatar: {
      type: Object,
      required: true,
      validator: obj =>
        ['is_default', 'height', 'link', 'width'].every(key => key in obj)
    }
  },
  data() {
    return {
      promise: null
    }
  },
  methods: {
    changeAvatar() {
      this.$refs.avatarFileInput.click()
    },
    avatarChanged(e) {
      if (!e.target.files.length) return
      const [file] = e.target.files
      const fr = new FileReader()
      if (file.size > 2097000) {
        this.$toast.error('Over 2MiB.')
        return
      }
      fr.readAsDataURL(file)
      const fd = new FormData()
      fd.append('avatar', file)
      this.promise = api()
        .post('/proxy/users/me/avatar', fd, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Content-Length': file.size
          }
        })
        .then(response => {
          this.$emit('update:avatar', response.data.content.avatar_image)
          this.$toast.success('Changed!')
        })
        .catch(err => {
          this.$toast.error(err.response.data.meta.error_message)
        })
        .then(() => (this.promise = null))
    }
  }
}
</script>
