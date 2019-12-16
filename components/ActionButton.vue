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
        @change="change($event.target.checked)"
      >
      <font-awesome-icon :icon="computedIcon" size="lg" fixed-width />
    </label>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { actionable } from '~/assets/ts/actionable'

export default Vue.extend({
  name: 'ActionButton',
  mixins: [actionable],
  props: {
    icon: {
      type: [String, Array],
      default: '',
      validator: val =>
        typeof val === 'string' || (typeof val === 'object' && val.length === 2)
    } as PropOptions<string | [string, string]>
  },
  computed: {
    computedIcon(): string {
      if (typeof this.icon === 'object') {
        // TODO
        return this.icon[+(this as any).checked]
      } else {
        return this.icon
      }
    }
  }
})
</script>

<style scoped lang="scss">
@import '~assets/css/override';

.active {
  color: $themeAttention;
}
</style>
