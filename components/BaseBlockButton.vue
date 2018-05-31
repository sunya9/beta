<template>
	<span>
		<slot :toggle-block="toggleBlock" />
	</span>
</template>
<script>
export default {
  props: {
    profile: {
      type: Object,
      required: true
    }
  },
  methods: {
    async toggleBlock() {
      const method = this.profile.you_blocked ? '$delete' : '$put'
      const prevValue = this.profile
      try {
        const { data: profile } = await this.$axios[method](
          `/users/${this.profile.id}/block`
        )
        this.$emit('update:profile', profile)
      } catch (e) {
        this.$emit('update:profile', prevValue)
      }
    }
  }
}
</script>
