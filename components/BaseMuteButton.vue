<template>
  <span> <slot :toggle-mute="toggleMute" /> </span>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from '~/models/user'
export default Vue.extend({
  name: 'BaseMuteButton',
  props: {
    profile: {
      type: Object,
      required: true
    } as PropOptions<User>
  },
  methods: {
    async toggleMute() {
      const method = this.profile.you_muted ? 'delete' : 'put'
      const prevValue = this.profile
      try {
        const { data: profile } = await this.$axios.$request({
          url: `/users/${this.profile.id}/mute`,
          method
        })
        this.$emit('update:profile', profile)
      } catch (e) {
        this.$emit('update:profile', prevValue)
      }
    }
  }
})
</script>
