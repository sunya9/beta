<template>
  <div class="custom-control custom-checkbox">
    <input
      :id="id"
      :disabled="disabled || processing"
      :checked="checked"
      type="checkbox"
      class="custom-control-input"
      @change="change($event.target.checked)">
    <label
      :for="id"
      class="custom-control-label">
      <slot />
    </label>
    <i
      v-if="processing"
      class="fa fa-spinner fa-pulse fa-fw"/>
  </div>
</template>
<script>
import actionable from '~/assets/js/actionable'

export default {
  mixins: [actionable],
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      id: null
    }
  },
  mounted() {
    this.id = `checkbox-${this._uid}`
  }
}
</script>
