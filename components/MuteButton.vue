<template>
  <base-mute-button
    :profile="profile"
    v-bind="$attrs"
    v-on="$listeners">
    <a
      slot-scope="{ toggleMute }"
      href="#"
      @click="toggleMute">
      <i
        :class="color"
        class="fa fa-eye-slash"/>
    </a>
  </base-mute-button>
</template>
<script>
import BaseMuteButton from '~/components/BaseMuteButton'
export default {
  components: {
    BaseMuteButton
  },
  props: {
    profile: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    color() {
      return this.profile.you_muted ? 'text-danger' : 'text-secondary'
    }
  }
}
</script>
