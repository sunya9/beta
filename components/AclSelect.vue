<template>
  <select
    v-if="!isPublic"
    v-bind="$attrs"
    :value="value"
    class="form-control"
    @change="$emit('change', $event.target.value)"
  >
    <option v-if="!anyUserRead">read</option>
    <option v-if="!anyUserWrite">write</option>
    <option
      :disabled="!isOwner"
      value="full">moderate</option>
  </select>
</template>
<script>
import { mapGetters } from 'vuex'

const permissions = ['read', 'write', 'full']
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: 'read',
      validator: permission => permissions.includes(permission)
    },
    anyUserRead: {
      type: Boolean,
      default: false
    },
    anyUserWrite: {
      type: Boolean,
      default: false
    },
    yourPermission: {
      type: String,
      validator: permission => !permission || permissions.includes(permission),
      default: ''
    },
    ownerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters(['user']),
    isOwner() {
      return this.user && this.user.id === this.ownerId
    },
    haveFullPermission() {
      return this.yourPermission === 'full'
    },
    isPublic() {
      return this.anyUserWrite && this.ownerLike
    },
    ownerLike() {
      return this.isOwner && this.haveFullPermission
    },
    isModeratorNotOwner() {
      return !this.isOwner && this.haveFullPermission
    }
  }
}
</script>
