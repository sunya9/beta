<template>
  <div>
    <div class="form-group">
      <h5>Long Post <small>(tags and usernames ignored)</small></h5>

      <div class="form-group">
        <input
          v-model="longpost.title"
          type="text"
          placeholder="Optional Title"
          class="form-control"
          pattern="(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.){0,128}"
          title="Up to 128 characters"
        >
      </div>

      <div class="form-group">
        <textarea
          v-model="longpost.body"
          class="form-control"
          placeholder="Body (~6000 characters)"
          maxlength="6144"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { LongPost } from '~/models/raw/raw/long-post'

export default Vue.extend({
  data() {
    return {
      longpost: {
        title: '',
        body: ''
      }
    }
  },
  watch: {
    longpost: {
      deep: true,
      handler(longpost: LongPost.Value) {
        this.$emit('update:longpost', longpost)
      },
      immediate: true
    }
  }
})
</script>
<style scoped lang="scss">
@import '~assets/css/override';

input[type='text']:invalid {
  border-color: map-get($theme-colors, danger);
}
</style>
