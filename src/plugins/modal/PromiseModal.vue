<template>
  <div>
    <slot :ok="ok" :cancel="cancel" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mediator } from './mediator'

export default Vue.extend({
  data(): {
    resolve: ((value: any) => void) | null
    reject: ((reason: Error) => void) | null
  } {
    return {
      resolve: null,
      reject: null,
    }
  },
  mounted() {
    mediator.$set(mediator.modals, this.$el.id, this)
  },
  methods: {
    show(...arg: any) {
      this.$emit('show', ...arg)
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    ok(arg: any) {
      if (!this.resolve) return false
      this.resolve(arg)
      this.hide(arg)
      return true
    },
    cancel(arg: any) {
      if (!this.reject) return false
      this.reject(arg)
      this.hide(arg)
      return true
    },
    hide(arg: any) {
      if (this.resolve || this.reject) this.$emit('hide', arg)
      this.resolve = null
      this.reject = null
    },
  },
})
</script>
