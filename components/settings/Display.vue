<template>
  <div>
    <custom-checkbox v-model="square">
      Square avatars
    </custom-checkbox>
    <custom-checkbox v-model="theme">
      Dark theme (will refresh to take effect)
    </custom-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomCheckbox from '../CustomCheckbox.vue'

export default Vue.extend({
  components: {
    CustomCheckbox,
  },
  data() {
    return {
      square: false,
      theme: false,
      error: null,
    }
  },
  watch: {
    square(newVal: boolean) {
      localStorage.setItem('square_avatars', newVal.toString())
    },
    theme(newVal: boolean) {
      if (
        (newVal && localStorage.getItem(`dark_theme`) !== 'true') ||
        (!newVal && localStorage.getItem(`dark_theme`) === 'true')
      ) {
        localStorage.setItem('dark_theme', newVal.toString())
        window.location.reload()
      }
    },
  },
  mounted() {
    this.square = localStorage.getItem(`square_avatars`) === 'true'
    this.theme = localStorage.getItem(`dark_theme`) === 'true'
  },
})
</script>
