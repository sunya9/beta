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
import { Component, Mixins, Prop } from 'vue-property-decorator'
import { actionable } from '~/assets/ts/actionable'

@Component({})
export default class extends Mixins(actionable) {
  @Prop({
    type: Boolean,
    default: false,
  })
  disabled!: boolean

  id: string | null = null

  mounted() {
    // FIXME
    this.id = `checkbox-${(this as any)._uid}`
  }
}
</script>
