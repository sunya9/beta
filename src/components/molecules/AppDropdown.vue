<template>
  <div class="position-relative">
    <div @click.prevent.stop="show">
      <slot name="button" />
    </div>
    <transition
      name="header-dropdown"
      enter-active-class="animate__animated animate__fadeInDown"
      leave-active-class="animate__animated animate__fadeOutUp"
      tag="div"
    >
      <slot v-if="value" @click.stop="hide" />
    </transition>
  </div>
</template>
<script lang="ts">
import { Prop, Component } from 'vue-property-decorator'
import Vue from 'vue'

@Component
export default class AppDropdown extends Vue {
  @Prop({ type: Boolean, required: false, default: false })
  value!: boolean

  mounted() {
    document.addEventListener('click', this.hide)
  }

  show() {
    this.$emit('input', !this.value)
  }

  hide() {
    this.$emit('input', false)
  }

  beforeDestroy() {
    document.removeEventListener('click', this.hide)
  }
}
</script>
