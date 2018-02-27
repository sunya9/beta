<template>
  <div class="custom-control custom-checkbox">
    <input
      type="checkbox"
      :id="id"
      class="custom-control-input"
      @change="change($event.target.checked)"
      :disabled="disabled || processing"
      :checked="checked">
    <label :for="id" class="custom-control-label">
      <slot />
    </label>
    <i class="fa fa-spinner fa-pulse fa-fw" v-if="processing"></i>
  </div>
</template>
<script>
import actionable from '~/assets/js/actionable'

export default {
  mixins: [actionable],
  props: {
    disabled: Boolean
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
