<template>
  <base-mute-button
    :profile="profile"
    v-bind="$attrs"
    v-on="$listeners">
    <a
      slot-scope="{ toggleMute }"
      href="#"
      @click="toggleMute">
      <font-awesome-icon
        :class="color"
        icon="eye-slash"
      />
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
