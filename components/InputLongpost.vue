<template>
  <div>
    <div class="form-group">
      <h5>Long Post <small>(tags and usernames ignored)</small></h5>

      <div class="form-group">
        <input type="text" v-model="longpost.title" placeholder="Optional Title" class="form-control"
          pattern="(?:[\uD800-\uDBFF][\uDC00-\uDFFF]|.){0,128}"
          title="Up to 128 characters"
        >
      </div>

      <div class="form-group">
        <textarea class="form-control" v-model="longpost.body" placeholder="Body (~6000 characters)" maxlength="6144">
        </textarea>
      </div>
    </div>
  </div>
</template>
<script>
export default {
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
      handler(longpost) {
        this.$emit('update:longpost', longpost)
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
