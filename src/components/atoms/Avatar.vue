<template>
  <img
    :class="{
      'rounded-circle': !isSquare,
      'is-deleted': isDeletedUser,
    }"
    :width="size"
    :height="size"
    :srcset="srcset"
    :src="src"
    v-bind="$attrs"
    loading="lazy"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { User } from '~/models/user'
import deletedUser from '~/assets/img/beta.svg'

function sizeValidator(numLike: string) {
  return [0, 16, 24, 32, 48, 64, 96].includes(parseInt(numLike))
}

function avatarIsString(avatar: User.UserImage | string): avatar is string {
  return typeof avatar === 'string'
}

@Component({})
export default class Avatar extends Vue {
  @Prop({
    type: [Object, String],
    required: false,
    validator(obj) {
      return obj === null || typeof obj === 'string' || 'link' in obj
    },
    default: '',
  })
  avatar!: User.UserImage | string | null

  @Prop({
    type: Boolean,
    default: false,
  })
  enablePlaceholder!: boolean

  @Prop({
    type: [String, Number],
    default: 24,
    validator: sizeValidator,
  })
  size!: number | string

  @Prop({
    type: [String, Number],
    default: 0,
    validator: sizeValidator,
  })
  maxSize!: number | string

  isSquare = false

  get url(): string {
    if (!this.avatar || this.enablePlaceholder) return ''
    return avatarIsString(this.avatar)
      ? /^(@\w+|\d+)$/.test(this.avatar)
        ? `https://api.pnut.io/v0/users/${this.avatar}/avatar`
        : this.avatar
      : this.avatar.link
    // ''
  }

  get isDeletedUser(): boolean {
    return !this.avatar
  }

  get src(): string {
    if (!this.url) return deletedUser
    let src = this.url
    if (this.maxSize > 0) src += `?w=${this.maxSize}`
    return src
  }

  get srcset(): string {
    if (!this.url) return ''
    return `${this.url}?w=${(+this.size || +this.maxSize) * 2} 2x`
  }

  mounted() {
    this.isSquare = localStorage.getItem('square_avatars') === 'true'
  }
}
</script>
<style scoped>
.is-deleted {
  opacity: 0.5;
}
</style>
