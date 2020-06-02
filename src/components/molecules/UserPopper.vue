<template>
  <div>
    <b-popover
      v-if="user"
      triggers="hover"
      :target="() => target()"
      placement="top"
    >
      <user-popper-inner :user="user" @update:user="update" />
    </b-popover>
    <slot />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import UserPopperInner from './UserPopperInner.vue'
import { User } from '~/models/user'

@Component({
  components: { UserPopperInner },
})
export default class UserPopper extends Vue {
  @Prop({
    type: Object,
    required: false,
  })
  user!: User | null

  target() {
    return this.$children[1]?.$el
  }

  update(newUser: User) {
    this.$emit('update:user', newUser)
  }
}
</script>
<style scoped>
.media-body p {
  white-space: pre-wrap;
  word-break: break-all;
  overflow-wrap: anywhere;
}
</style>
