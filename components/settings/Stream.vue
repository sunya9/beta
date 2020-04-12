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

<script lang="ts">
import Vue from 'vue'
import CustomCheckbox from '../CustomCheckbox.vue'

export default Vue.extend({
  components: {
    CustomCheckbox,
  },
  data() {
    return {
      unified: localStorage.unified_timeline === 'true',
      directed: localStorage.hide_directed_posts === 'true',
      error: null,
    }
  },
  watch: {
    unified(newVal: boolean) {
      localStorage.setItem('unified_timeline', newVal.toString())
    },
    directed(newVal: boolean) {
      localStorage.setItem('hide_directed_posts', newVal.toString())
    },
  },
})
</script>
