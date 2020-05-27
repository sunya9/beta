<template>
  <div>
    <slot :ok="ok" :cancel="cancel" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { mediator } from './mediator'

@Component({})
export default class PromiseModal extends Vue {
  resolve: ((value: any) => void) | null = null
  reject: ((reason: Error) => void) | null = null
  mounted() {
    mediator.$set(mediator.modals, this.$el.id, this)
    this.$on('ok', this.ok)
    this.$on('cancel', this.cancel)
  }

  beforeDestory() {
    this.$off('ok', this.ok)
    this.$off('cancel', this.cancel)
  }

  show(...arg: any) {
    this.$emit('show', ...arg)
    return new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  ok(arg: any) {
    if (!this.resolve) return false
    this.resolve(arg)
    this.hide(arg)
    return true
  }

  cancel(arg: any) {
    if (!this.reject) return false
    this.reject(arg)
    this.hide(arg)
    return true
  }

  hide(arg: any) {
    if (this.resolve || this.reject) this.$emit('hide', arg)
    this.resolve = null
    this.reject = null
  }
}
</script>
