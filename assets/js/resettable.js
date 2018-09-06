export default {
  methods: {
    reset() {
      Object.assign(this.$data, this.$options.data.apply(this))
    }
  }
}
