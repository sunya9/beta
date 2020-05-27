import Vue from 'vue'

export default Vue.extend({
  methods: {
    reset() {
      const functionData =
        typeof this.$options.data === 'function' ? this.$options.data : null
      if (!functionData) return
      Object.assign(this.$data, functionData.apply(this))
    },
  },
})
