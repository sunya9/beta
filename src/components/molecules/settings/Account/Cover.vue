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
          class="img-thumbnail"
          loading="lazy"
        />
      </div>
      <div class="form-group">
        <input
          ref="coverFileInput"
          type="file"
          accept="image/*"
          style="display: none"
          @change="changeCover"
        />
        <button
          :disabled="promise"
          type="button"
          class="btn btn-outline-secondary"
          @click="$refs.coverFileInput.click()"
        >
          Change cover
        </button>
        <button
          v-if="!internalCover.is_default"
          v-b-modal.confirm
          class="btn btn-link"
        >
          Remove cover
        </button>
        <b-modal id="confirm" title="Remove the cover" @ok="removeCover">
          Are you sure?
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { User } from '~/entity/user'

function isFileInput(t: EventTarget): t is HTMLInputElement {
  return 'files' in t
}

@Component
export default class AccountCover extends Vue {
  @Prop({
    type: Object,
    required: true,
    validator(obj) {
      return ['is_default', 'height', 'width', 'height'].every(
        (key) => key in obj
      )
    },
  })
  cover!: User.UserImage

  promise = false

  internalCover = this.cover

  async changeCover(e: Event) {
    if (
      !e.target ||
      !isFileInput(e.target) ||
      !e.target.files ||
      !e.target.files.length
    )
      return false
    await this.updateCover(e.target.files[0])
    this.$toast.success('Changed!')
  }

  async updateCover(file?: File) {
    this.promise = true
    await this.$interactors.updateCover
      .run({ file })
      .then((output) => (this.internalCover = output.cover))
      .finally(() => (this.promise = false))
  }

  async removeCover() {
    await this.updateCover()
    this.$toast.success('Deleted.')
  }

  $refs!: {
    coverFileInput: HTMLInputElement
  }
}
</script>
