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

<script>
function sizeValidator(numLike) {
  return [0, 16, 24, 32, 64, 96].includes(parseInt(numLike))
}

const TRANSPARENT_BASE64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export default {
  name: 'Avatar',
  props: {
    avatar: {
      type: [Object, String],
      validator(obj) {
        return typeof obj === 'string' || 'link' in obj
      },
      default: ''
    },
    enablePlaceholder: {
      type: Boolean,
      default: false
    },
    size: {
      type: [String, Number],
      default: 24,
      validator: sizeValidator
    },
    maxSize: {
      type: [String, Number],
      default: 0,
      validator: sizeValidator
    }
  },
  data() {
    return {
      isSquare: false
    }
  },
  computed: {
    url() {
      if (!this.avatar || this.enablePlaceholder) return null
      return typeof this.avatar === 'string'
        ? /^(@\w+|\d+)$/.test(this.avatar)
          ? `https://api.pnut.io/v0/users/${this.avatar}/avatar`
          : this.avatar
        : this.avatar.link
      // ''
    },
    src() {
      if (!this.url) return TRANSPARENT_BASE64
      let src = this.url
      if (this.maxSize > 0) src += `?w=${this.maxSize}`
      return src
    },
    srcset() {
      return `${this.url}?w=${(this.size || this.maxSize) * 2} 2x`
    }
  },
  mounted() {
    this.isSquare = localStorage.getItem('square_avatars') === 'true'
  }
}
</script>
