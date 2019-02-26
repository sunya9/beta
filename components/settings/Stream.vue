<template>
  <div>
    <custom-checkbox v-model="directed">
      Hide posts directed at people you do not follow
    </custom-checkbox>
    <custom-checkbox v-model="unified">
      Include your mentions in your personal stream
    </custom-checkbox>
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
      unified: localStorage['unified_timeline'] === 'true' ? true : false,
      directed: localStorage['hide_directed_posts'] === 'true' ? true : false,
      error: null
    }
  },
  watch: {
    unified(newVal) {
      localStorage.setItem('unified_timeline', newVal)
    },
    directed(newVal) {
      localStorage.setItem('hide_directed_posts', newVal)
    }
  }
}
</script>
