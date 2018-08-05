<template>
  <div>
    <div class="form-group">
      <h5>Spoiler Alert</h5>
      <input type="text" v-model="spoiler.topic" placeholder="Topic" class="form-control"
        pattern="(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.){0,128}"
        title="Up to 128 characters"
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      spoiler: {
        topic: ''
      }
    }
  },
  watch: {
    spoiler: {
      deep: true,
      handler(spoiler) {
        this.$emit('update:spoiler', spoiler)
      },
      immediate: true
    }
  }
}
</script>
<style scoped lang="scss">
@import '~assets/css/override';

input[type='text']:invalid {
  border-color: map-get($theme-colors, danger);
}
</style>
