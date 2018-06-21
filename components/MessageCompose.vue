<template>
	<div class="card mb-4 no-gutter-xs">
		<div class="card-body">
			<form @submit.prevent="submit">
				<div class="form-group" v-if="createChannelMode">
					<input type="text" v-model="channelUsersStr" class="form-control" placeholder="usernames (comma or space delimited)" />
				</div>
				<div class="form-group">
					<textarea class="form-control" v-model="text" @keydown.ctrl.enter="submit" @keydown.meta.enter="submit" :disabled="promise">
					</textarea>
				</div>
				<div class="d-flex justify-content-between align-items-center">
					<span>{{remain}}</span>
					<button type="submit" class="btn text-uppercase btn-primary" :disabled="calcDisabled">
						<span v-show="promise">
							<i class="fa fa-refresh fa-spin fa-fw"></i>&nbsp;
						</span>
						Send
					</button>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
import textCount from '~/assets/js/text-count'

export default {
  mixins: [textCount],
  props: {
    createChannelMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      promise: null,
      channelUsersStr: '',
      text: ''
    }
  },
  computed: {
    calcDisabled() {
      const requireTargetValue = this.createChannelMode && !this.channelUsersStr
      return requireTargetValue || this.promise || !this.text
    },
    remain() {
      return 2048 - this.textLength
    }
  },
  methods: {
    async submit() {
      if (this.createChannelMode) return this.createChannel()
      const option = {
        text: this.text
      }
      try {
        this.promise = this.$axios.$post(
          `/channels/${this.$route.params.channel}/messages`,
          option
        )
        const { meta } = await this.promise
        if (meta.code === 201) {
          this.$emit('submit')
        }
        this.text = ''
      } catch (e) {
        console.error(e)
        this.$toast.error(e.message)
      }
      this.promise = null
    },
    async createChannel() {
      const destinations = this.channelUsersStr.split(/[,\s]+/g).map(name => {
        return name.startsWith('@') ? name : `@${name}`
      })
      const option = {
        text: this.text,
        destinations
      }
      const { data: channel } = await this.$axios.$post(
        '/channels/pm/messages',
        option
      )
      this.channelUsersStr = ''
      this.text = ''
      this.$router.push(`/messages/${channel.channel_id}`)
    }
  }
}
</script>

<style scoped>
textarea {
  min-height: 5rem;
}
</style>
