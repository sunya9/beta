<template>
  <div class="row">
    <div class="col-sm-12 col-md-3">
      <h4>Avatar</h4>
      <p>Square, Up to 2MiB</p>
    </div>
    <div class="col-ms-12 col-md-9">
      <div class="form-group">
        <img
          ref="avatar_image"
          :src="internalAvatar.link"
          width="128"
          height="128"
          alt="avatar image"
        >
      </div>
      <div class="form-group">
        <input
          ref="avatarFileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="avatarChanged"
        >
        <button
          :disabled="promise"
          type="button"
          class="btn btn-outline-secondary"
          @click="changeAvatar"
        >
          Change avatar
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from '~/models/user'
import { PnutResponse } from '~/models/pnut-response'

export default Vue.extend({
  props: {
    avatar: {
      type: Object,
      required: true,
      validator: (obj: object) =>
        ['is_default', 'height', 'link', 'width'].every(key => key in obj)
    } as PropOptions<User.UserImage>
  },
  data() {
    return {
      promise: null as Promise<PnutResponse<User>> | null,
      internalAvatar: this.avatar
    }
  },
  methods: {
    changeAvatar() {
      // TODO
      ;(this.$refs.avatarFileInput as HTMLInputElement).click()
    },
    async avatarChanged(e: Event) {
      if (!e.target) return
      const target = e.target as HTMLInputElement
      if (!target.files || !target.files.length) return false
      const file = target.files[0]
      if (file.size > 2097000) {
        this.$toast.error('Over 2MiB.')
        return
      }
      const fd = new FormData()
      fd.append('avatar', file)
      try {
        this.promise = this.$axios
          .$post<PnutResponse<User>>('/users/me/avatar', fd, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .catch(err => {
            throw new Error(err.response.data.meta.error_message)
          })
        const response = await this.promise
        if (!response.data.content) return // TODO: improve error handling
        this.internalAvatar = response.data.content.avatar_image
        this.$toast.success('Changed!')
      } catch (err) {
        this.$toast.error(err.message)
      }
      this.promise = null
    }
  }
})
</script>
