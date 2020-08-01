<template>
  <span><slot :toggle-block="toggleBlock" /></span>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from '~/models/user'

export default Vue.extend({
  name: 'BlockButton',
  props: {
    profile: {
      type: Object,
      required: true,
    } as PropOptions<User>,
  },
  methods: {
    async toggleBlock() {
      const prevValue = this.profile.you_blocked
      try {
        this.update({ you_blocked: !this.profile.you_blocked })
        const {
          res: { data: profile },
        } = await this.$interactors.updateRelation.run({
          type: this.profile.you_blocked ? 'unblock' : 'block',
          userId: this.profile.id,
        })
        this.update(profile)
      } catch (e) {
        this.update({ you_blocked: prevValue })
      }
    },
    update(user: Partial<User>) {
      this.$emit('update:profile', { ...this.profile, ...user })
    },
  },
})
</script>
