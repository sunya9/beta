<template>
  <span> <slot :toggle-mute="toggleMute" /> </span>
</template>
<script>
export default {
  name: 'BaseMuteButton',
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  methods: {
    async toggleMute() {
      const method = this.profile.you_muted ? '$delete' : '$put'
      const prevValue = this.profile
      try {
        const { data: profile } = await this.$axios[method](
          `/users/${this.profile.id}/mute`
        )
        this.$emit('update:profile', profile)
      } catch (e) {
        this.$emit('update:profile', prevValue)
      }
    }
  }
}
</script>
