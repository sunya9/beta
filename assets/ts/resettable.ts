import Vue from 'vue'

export default Vue.extend({
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
})
