<template>
  <button
    v-if="!blocking"
    :class="btnClass"
    :disabled="busy"
    class="btn"
    @click="follow"
  >
    {{ text }}
  </button>
  <button
    v-else
    :disabled="busy"
    class="btn btn-danger"
    @click="unblock"
  >
    Unblock
  </button>
</template>

<script>
export default {
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      busy: false,
      following: this.profile.you_follow,
      blocking: this.profile.you_blocked
    }
  },
  computed: {
    text() {
      return this.following ? 'Following' : 'Follow'
    },
    btnClass() {
      return `btn-${this.following ? 'secondary' : 'primary'}`
    }
  },
  methods: {
    async follow() {
      const method = this.profile.you_follow ? '$delete' : '$put'
      const prev = this.profile.you_follow
      this.updateProfile({ you_follow: !this.profile.you_follow })
      this.busy = true
      try {
        const { data: profile } = await this.$axios[method](
          `/users/${this.profile.id}/follow`
        )
        this.updateProfile(profile)
      } catch (e) {
        this.$toast.error(e.message)
        this.updateProfile({ you_follow: prev })
      }
      this.busy = false
    },
    updateProfile(newProfile) {
      this.following = newProfile.you_follow
      this.blocking = newProfile.you_blocked
      this.$emit('update:profile', { ...this.profile, ...newProfile })
    },
    async unblock() {
      this.updateProfile({ you_blocked: false })
      this.busy = true
      try {
        const { data: profile } = await this.$axios.$delete(
          `/users/${this.profile.id}/block`
        )
        this.updateProfile(profile)
      } catch (e) {
        this.$toast.error(e.message)
        this.updateProfile({ you_blocked: true })
      }
      this.busy = false
    }
  }
}
</script>
