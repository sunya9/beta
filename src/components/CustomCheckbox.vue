<template>
  <div class="custom-control custom-checkbox">
    <input
      :id="id"
      :disabled="disabled || processing"
      :checked="checked"
      type="checkbox"
      class="custom-control-input"
      @change="change($event.target.checked)"
    />
    <label :for="id" class="custom-control-label">
      <slot />
    </label>
    <font-awesome-icon v-if="processing" pulse fixed-width icon="spinner" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { actionable } from '~/assets/ts/actionable'

export default Vue.extend({
  mixins: [actionable],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: null as string | null,
    }
  },
  mounted() {
    // FIXME
    this.id = `checkbox-${(this as any)._uid}`
  },
})
</script>
