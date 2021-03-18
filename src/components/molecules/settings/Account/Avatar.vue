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
          loading="lazy"
        />
      </div>
      <div class="form-group">
        <input
          ref="avatarFileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="changeAvatar"
        />
        <button
          :disabled="promise"
          type="button"
          class="btn btn-outline-secondary"
          @click="$refs.avatarFileInput.click()"
        >
          Change avatar
        </button>
        <button
          v-if="!internalAvatar.is_default"
          v-b-modal.avatar-confirm
          class="btn btn-link"
        >
          Remove avatar
        </button>
        <b-modal
          id="avatar-confirm"
          title="Remove the avatar"
          @ok="removeAavatar"
        >
          Are you sure?
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { User } from '~/entity/user'

function isFileInput(t: EventTarget): t is HTMLInputElement {
  return 'files' in t
}

@Component
export default class Avatar extends Vue {
  @Prop({
    type: Object,
    required: true,
    validator: (obj: object) =>
      ['is_default', 'height', 'link', 'width'].every((key) => key in obj),
  })
  avatar!: User.UserImage

  promise = false
  internalAvatar = this.avatar

  $refs!: {
    avatarFileInput: HTMLInputElement
  }

  async changeAvatar(e: Event) {
    if (
      !e.target ||
      !isFileInput(e.target) ||
      !e.target.files ||
      !e.target.files.length
    )
      return false
    await this.updateAvatar(e.target.files[0])
    this.$toast.success('Changed!')
  }

  updateAvatar(file?: File) {
    this.promise = true
    return this.$interactors.updateAvatar
      .run({ file })
      .then((res) => (this.internalAvatar = res.avatar))
      .finally(() => (this.promise = false))
  }

  async removeAavatar() {
    await this.updateAvatar()
    this.$toast.success('Deleted.')
  }
}
</script>
