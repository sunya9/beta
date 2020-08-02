<template>
  <span>
    <slot :toggle-mute="toggleMute">
      <button type="button" class="btn-text" @click="toggleMute">
        <font-awesome-icon :class="color" icon="eye-slash" />
      </button>
    </slot>
  </span>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from '~/entity/user'

export default Vue.extend({
  props: {
    profile: {
      type: Object,
      required: true,
    } as PropOptions<User>,
  },
  computed: {
    color(): string {
      return this.profile.you_muted ? 'text-danger' : 'text-secondary'
    },
  },
  methods: {
    async toggleMute() {
      const prev = this.profile.you_muted
      try {
        this.update({ you_muted: !this.profile.you_muted })
        const {
          res: { data: profile },
        } = await this.$interactors.updateRelation.run({
          type: this.profile.you_muted ? 'unmute' : 'mute',
          userId: this.profile.id,
        })
        this.update(profile)
      } catch (e) {
        this.$toast.error(e.message)
        this.update({ you_muted: prev })
      }
    },
    update(user: Partial<User>) {
      this.$emit('update:profile', { ...this.profile, ...user })
    },
  },
})
</script>
