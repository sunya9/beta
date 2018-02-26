<template>
  <img :src="src" :class="{
    'rounded-circle': !isSquare
  }"
  :width="size" :height="size" v-bind="$attrs" />
</template>

<script>
export default {
  props: {
    avatar: {
      type: Object,
      validator(obj) {
        return 'link' in obj
      }
    },
    size: {
      type: [String, Number],
      default: 24
    },
    maxSize: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      isSquare: false
    }
  },
  mounted() {
    this.isSquare = localStorage.getItem('square_avatars') === 'true'
  },
  computed: {
    src() {
      let src = this.avatar.link
      if (this.maxSize > 0) src += `?w=${this.maxSize}`
      return src
    }
  }
}
</script>
