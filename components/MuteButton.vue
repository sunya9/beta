<template>
	<base-mute-button :profile="profile" v-bind="$attrs" v-on="$listeners">
		<a slot-scope="{ toggleMute }" href="#" @click="toggleMute">
			<i class="fa fa-eye-slash" :class="color"></i>
		</a>
	</base-mute-button>
</template>
<script>
import BaseMuteButton from '~/components/BaseMuteButton'
export default {
  props: {
    profile: {
      type: Object
    }
  },
  computed: {
    color() {
      return this.profile.you_muted ? 'text-danger' : 'text-secondary'
    }
  },
  components: {
    BaseMuteButton
  }
}
</script>
