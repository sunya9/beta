<template>
  <div class="btn-group-toggle">
    <label
      :class="{
        disabled: processing,
        'text-primary': checked,
        'text-secondary': !checked
      }"
      class="btn btn-link btn-lg my-0 py-1 mx-0 px-0 rounded-0"
    >
      <input
        :checked="checked"
        type="checkbox"
        @change="change($event.target.checked)">
      <i
        :class="computedIcon"
        class="fa fa-lg fa-fw"/>
    </label>
  </div>
</template>

<script>
import actionable from '~/assets/js/actionable'

export default {
  mixins: [actionable],
  props: {
    icon: {
      type: [String, Array],
      default: '',
      validator: val =>
        typeof val === 'string' || (typeof val === 'object' && val.length === 2)
    }
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
