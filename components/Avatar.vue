<template>
  <img :src="src" :class="{
    'rounded-circle': !isSquare
  }" :width="size" :height="size" v-bind="$attrs" />
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
      type: Number,
      default: 24
    },
    maxSize: {
      type: Number,
      default: 128
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
      return `${this.avatar.link}?w=${this.maxSize}`
    }
  }
}
</script>
