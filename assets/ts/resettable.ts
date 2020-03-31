import Vue from 'vue'

export default Vue.extend({
  methods: {
    reset() {
      // TODO
      Object.assign(this.$data, (this as any).$options.data.apply(this))
    }
  }
})
