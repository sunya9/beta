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
  resolve: ((value?: any) => void) | null = null
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
    return new Promise((resolve) => {
      this.resolve = resolve
    })
  }

  ok(arg: any) {
    this.resolve?.(arg)
    this.hide()
    return true
  }

  cancel() {
    this.resolve?.()
    this.hide()
    return true
  }

  hide() {
    if (this.resolve) this.$emit('hide')
    this.resolve = null
  }
}
</script>
