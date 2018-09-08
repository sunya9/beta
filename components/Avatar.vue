<template>
  <img
    :src="src"
    :class="{
      'rounded-circle': !isSquare
    }"
    :width="size"
    :height="size"
    v-bind="$attrs" >
</template>

<script>
function sizeValidator(numLike) {
  return [0, 16, 24, 32, 64, 96].includes(parseInt(numLike))
}

export default {
  props: {
    avatar: {
      type: [Object, String],
      validator(obj) {
        return typeof obj === 'string' || 'link' in obj
      },
      required: true
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
      return typeof this.avatar === 'string'
        ? /^(@\w+|\d+)$/.test(this.avatar)
          ? `https://api.pnut.io/v0/users/${this.avatar}/avatar`
          : this.avatar
        : this.avatar.link
      // ''
    },
    src() {
      let src = this.url
      if (this.maxSize > 0) src += `?w=${this.maxSize}`
      return src
    }
  },
  mounted() {
    this.isSquare = localStorage.getItem('square_avatars') === 'true'
  }
}
</script>
