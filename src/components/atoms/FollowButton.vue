<template>
  <button
    v-if="user && user.id !== profile.id && !blocking"
    :class="{
      'btn-secondary': following,
      'btn-primary': !following,
    }"
    :disabled="busy"
    class="btn"
    @click="follow"
  >
    {{ text }}
  </button>
  <button
    v-else-if="blocking"
    :disabled="busy"
    class="btn btn-danger"
    @click="unblock"
  >
    Unblock
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { User } from '~/entity/user'

@Component({})
export default class FollowButton extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  profile!: User

  busy = false
  get following() {
    return this.profile.you_follow
  }

  get blocking() {
    return this.profile.you_blocked
  }

  get text(): string {
    return this.following ? 'Following' : 'Follow'
  }

  async follow() {
    const prev = this.profile.you_follow
    this.updateProfile({ you_follow: !this.profile.you_follow })
    this.busy = true
    try {
      const {
        res: { data: profile },
      } = await this.$interactors.updateRelation.run({
        type: this.profile.you_follow ? 'unfollow' : 'follow',
        userId: this.profile.id,
      })
      this.updateProfile(profile)
    } catch (e) {
      this.$toast.error(e.message)
      this.updateProfile({ you_follow: prev })
    } finally {
      this.busy = false
    }
  }

  updateProfile(newProfile: Partial<User>) {
    this.$emit('update:profile', { ...this.profile, ...newProfile })
  }

  async unblock() {
    this.updateProfile({ you_blocked: false })
    this.busy = true
    try {
      const {
        res: { data: profile },
      } = await this.$interactors.updateRelation.run({
        type: 'unblock',
        userId: this.profile.id,
      })
      this.updateProfile(profile)
    } catch (e) {
      this.$toast.error(e.message)
      this.updateProfile({ you_blocked: true })
    }
    this.busy = false
  }

  get user() {
    return this.$accessor.user
  }
}
</script>
