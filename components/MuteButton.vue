<template>
  <base-mute-button :profile="profile" v-bind="$attrs" v-on="$listeners">
    <a slot-scope="{ toggleMute }" href="#" @click="toggleMute">
      <font-awesome-icon :class="color" icon="eye-slash" />
    </a>
  </base-mute-button>
</template>
<script lang="ts">
import Vue, { PropOptions } from 'vue'
import BaseMuteButton from '~/components/BaseMuteButton.vue'
import { User } from '~/models/user'

export default Vue.extend({
  components: {
    BaseMuteButton,
  },
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
})
</script>
