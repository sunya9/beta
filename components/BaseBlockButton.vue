<template>
  <span><slot :toggle-block="toggleBlock" /></span>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { User } from '~/models/user'
import { PnutResponse } from '~/models/pnut-response'

export default Vue.extend({
  name: 'BaseBlockButton',
  props: {
    profile: {
      type: Object,
      required: true,
    } as PropOptions<User>,
  },
  methods: {
    async toggleBlock() {
      const method = this.profile.you_blocked ? 'delete' : 'put'
      const prevValue = this.profile
      try {
        const { data: profile } = await this.$axios.$request<
          PnutResponse<User>
        >({
          url: `/users/${this.profile.id}/block`,
          method,
        })
        this.$emit('update:profile', profile)
      } catch (e) {
        this.$emit('update:profile', prevValue)
      }
    },
  },
})
</script>
