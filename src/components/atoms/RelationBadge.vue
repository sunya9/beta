<template>
  <span
    v-if="!myself && relation"
    data-test-id="relation"
    class="ml-1 badge badge-secondary badge-pill text-uppercase"
  >
    {{ relation }}
  </span>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import { User, UserEntity } from '~/entity/user'

@Component
export default class RelationBadge extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  user!: User

  get userEntity() {
    return new UserEntity(this.user)
  }

  get myself() {
    return this.userEntity.isMe
  }

  get relation(): string {
    return this.user.follows_you ? 'Follows you' : ''
  }
}
</script>
