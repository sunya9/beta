<template>
  <div>
    <div class="form-group">
      <h5>Spoiler Alert</h5>
      <input
        v-model="spoiler.topic"
        type="text"
        placeholder="Topic"
        class="form-control"
        pattern="(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.){0,128}"
        title="Up to 128 characters"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Spoiler } from '~/models/raw/raw/spoiler'

export default Vue.extend({
  data() {
    return {
      spoiler: {
        topic: '',
      },
    }
  },
  watch: {
    spoiler: {
      deep: true,
      handler(spoiler: Spoiler.Value) {
        this.$emit('update:spoiler', spoiler)
      },
      immediate: true,
    },
  },
})
</script>
<style scoped lang="scss">
@import '~assets/css/override';

input[type='text']:invalid {
  border-color: map-get($theme-colors, danger);
}
</style>
