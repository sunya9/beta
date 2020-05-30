<template>
  <div class="btn-group-toggle">
    <label
      :class="{
        disabled: processing,
        'text-primary': checked,
        'text-secondary': !checked,
      }"
      class="btn btn-link btn-lg my-0 py-1 mx-0 px-0 rounded-0"
    >
      <input
        :checked="checked"
        type="checkbox"
        @change="change($event.target.checked)"
      />
      <font-awesome-icon :icon="computedIcon" size="lg" fixed-width />
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import { Mixins } from 'vue-property-decorator'
import { actionable } from '~/assets/ts/actionable'

@Component({})
class ActionButton extends Mixins(actionable) {
  @Prop({
    type: [String, Array],
    default: '',
    validator: (val) =>
      typeof val === 'string' || (typeof val === 'object' && val.length === 2),
  })
  icon!: string | [string, string]

  get computedIcon(): string {
    if (typeof this.icon === 'object') {
      return this.icon[+this.checked]
    } else {
      return this.icon
    }
  }
}

export default ActionButton
</script>

<style scoped lang="scss">
@import '~assets/css/override';

.active {
  color: $themeAttention;
}
</style>
