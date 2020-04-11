<template>
  <img
    :src="src"
    :class="{
      'rounded-circle': !isSquare,
      'is-deleted': isDeletedUser
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
import deletedUser from '~/assets/img/beta.svg'

function sizeValidator(numLike: string) {
  return [0, 16, 24, 32, 64, 96].includes(parseInt(numLike))
}

function avatarIsString(avatar: User.UserImage | string): avatar is string {
  return typeof avatar === 'string'
}
export default Vue.extend({
  name: 'Avatar',
  props: {
    avatar: {
      type: [Object, String],
      required: false,
      validator(obj) {
        return obj === null || typeof obj === 'string' || 'link' in obj
      },
      default: ''
    } as PropOptions<User.UserImage | string | null>,
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
    isDeletedUser(): boolean {
      return !this.avatar
    },
    src(): string {
      if (!this.url) return deletedUser
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
<style scoped>
.is-deleted {
  opacity: 0.5;
}
</style>
