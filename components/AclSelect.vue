<template>
  <select
    v-if="!isPublic"
    v-bind="$attrs"
    :value="value"
    class="form-control"
    @change="$emit('change', $event.target.value)"
  >
    <option v-if="!anyUserRead">
      read
    </option>
    <option v-if="!anyUserWrite">
      write
    </option>
    <option :disabled="!isOwner" value="full">
      moderate
    </option>
  </select>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from '~/models/user'
import { Channel } from '~/models/channel'

const permissions: Channel.Permission[] = ['read', 'write', 'full']
export default Vue.extend({
  name: 'AclSelect',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: 'read',
      validator: permission => permissions.includes(permission)
    } as PropOptions<Channel.Permission>,
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
      default: 'read'
    } as PropOptions<Channel.Permission>,
    ownerId: {
      type: String,
      default: ''
    }
  },
  computed: {
    user(): User {
      return this.$store.state.user
    },
    isOwner(): boolean {
      return this.user && this.user.id === this.ownerId
    },
    haveFullPermission(): boolean {
      return this.yourPermission === 'full'
    },
    isPublic(): boolean {
      return this.anyUserWrite && this.ownerLike
    },
    ownerLike(): boolean {
      return this.isOwner && this.haveFullPermission
    },
    isModeratorNotOwner(): boolean {
      return !this.isOwner && this.haveFullPermission
    }
  }
})
</script>
