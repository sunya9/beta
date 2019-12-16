<template>
  <img
    :src="src"
    :class="{
      'rounded-circle': !isSquare
    }"
    :width="size"
    :height="size"
    :srcset="srcset"
    v-bind="$attrs"
  >
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from '~/models/user'
function sizeValidator(numLike: string) {
  return [0, 16, 24, 32, 64, 96].includes(parseInt(numLike))
}

const TRANSPARENT_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

function avatarIsString(avatar: User.UserImage | string): avatar is string {
  return typeof avatar === 'string'
}
export default Vue.extend({
  name: 'Avatar',
  props: {
    avatar: {
      type: [Object, String],
      required: true,
      validator(obj) {
        return typeof obj === 'string' || 'link' in obj
      },
      default: ''
    } as PropOptions<User.UserImage | string>,
    enablePlaceholder: {
      type: Boolean,
      default: false
    },
    size: {
      type: [String, Number],
      default: 24,
      validator: sizeValidator
    } as PropOptions<number | string>,
    maxSize: {
      type: [String, Number],
      default: 0,
      validator: sizeValidator
    } as PropOptions<number | string>
  },
  data() {
    return {
      isSquare: false
    }
  },
  computed: {
    url(): string {
      if (!this.avatar || this.enablePlaceholder) return ''
      return avatarIsString(this.avatar)
        ? /^(@\w+|\d+)$/.test(this.avatar)
          ? `https://api.pnut.io/v0/users/${this.avatar}/avatar`
          : this.avatar
        : this.avatar.link
      // ''
    },
    src(): string {
      if (!this.url) return TRANSPARENT_BASE64
      let src = this.url
      if (this.maxSize > 0) src += `?w=${this.maxSize}`
      return src
    },
    srcset(): string {
      return `${this.url}?w=${(+this.size || +this.maxSize) * 2} 2x`
    }
  },
  mounted() {
    this.isSquare = localStorage.getItem('square_avatars') === 'true'
  }
})
</script>
