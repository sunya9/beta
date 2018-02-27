<template>
  <div class="btn-group-toggle">
    <label
      class="btn btn-link btn-lg my-0 py-1 mx-0 px-0 rounded-0"
      :class="{
        disabled: processing,
        'text-primary': checked,
        'text-secondary': !checked
      }"
    >
      <input type="checkbox" :checked="checked" @change="change($event.target.checked)">
      <i :class="computedIcon" class="fa fa-lg fa-fw"></i>
    </label>
  </div>
</template>

<script>
import actionable from '~/assets/js/actionable'

export default {
  mixins: [actionable],
  props: {
    icon: [Object, String, Array]
  },
  computed: {
    computedIcon() {
      if (typeof this.icon === 'object') {
        return this.icon[+this.checked]
      } else {
        return this.icon
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/css/override';

.active {
  color: $themeAttention;
}
</style>
