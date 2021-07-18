<template>
  <button
    :class="{
      'text-dark': !value,
      'btn-primary': value,
    }"
    class="btn btn-link"
    type="button"
    @click="$emit('input', !value)"
  >
    <div class="align-middle">
      <font-awesome-icon v-if="icon" :icon="icon" />
      <span class="d-none d-xl-inline ml-2">
        {{ text }}
      </span>
    </div>
  </button>
</template>
<script lang="ts">
import { Component, Prop, Model } from 'vue-property-decorator'

import Vue from 'vue'

@Component
export default class ToggleButton extends Vue {
  @Model('input', { type: Boolean, required: false, default: false })
  value!: boolean

  @Prop({ type: [String, Array], required: false, default: '' })
  icon!: string | string[]

  @Prop({ type: String, required: false, default: '' })
  text!: string
}
</script>
