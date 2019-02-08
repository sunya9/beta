<template>
  <div>
    <custom-checkbox
      v-model="directed"
      :disabled="true"
    >
      Hide posts directed at people you do not follow
    </custom-checkbox>
    <!--<custom-checkbox v-model="unified" :disabled="true">
      Unified timeline; include your mentions and personal stream together
    </custom-checkbox>-->
  </div>
</template>

<script>
import CustomCheckbox from '../CustomCheckbox'

export default {
  components: {
    CustomCheckbox
  },
  data() {
    return {
      unified: this.$store.state.unified_timeline,
      directed: this.$store.state.hide_directed_posts,
      error: null
    }
  },
  watch: {
    unified() {
      // this.$store.commit('TOGGLE_KEY', 'unified_timeline')
    },
    directed() {
      // this.$store.commit('TOGGLE_KEY', 'hide_directed_posts')
    }
  }
}
</script>
