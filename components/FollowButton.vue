<template>
	<button class="btn" :class="btnClass" @click="follow" :disabled="busy" v-if="!blockState">
		{{text}}
	</button>
	<button class="btn btn-danger" v-else @click="unblock" :disabled="busy">
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
      state: this.profile.you_follow,
      blockState: this.profile.you_blocked,
      busy: false
    }
  },
  watch: {
    'profile.you_blocked'(bool) {
      this.blockState = bool
    }
  },
  computed: {
    text() {
      return this.state ? 'Following' : 'Follow'
    },
    btnClass() {
      return `btn-${this.state ? 'secondary' : 'primary'}`
    }
  },
  methods: {
    async follow() {
      const method = this.state ? '$delete' : '$put'
      const prev = this.state
      this.state = !this.state
      this.busy = true
      try {
        const { data: profile } = await this.$axios[method](
          `/users/${this.profile.id}/follow`
        )
        this.$emit('update:profile', profile)
      } catch (e) {
        this.$toast.error(e.message)
        this.state = prev
      }
      this.busy = false
    },
    async unblock() {
      this.blockState = false
      this.busy = true
      try {
        const { data: profile } = await this.$axios.$delete(
          `/users/${this.profile.id}/block`
        )
        this.$emit('update:profile', profile)
      } catch (e) {
        this.$toast.error(e.message)
        this.blockState = true
      }
      this.busy = false
    }
  }
}
</script>
