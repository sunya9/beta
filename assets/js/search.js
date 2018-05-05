export default {
  watchQuery: ['q'],
  key: to => to.fullPath,
  watch: {
    '$route.query.q'(q) {
      this.options = {
        ...this.options,
        q: encodeURIComponent(q)
      }
    },
    async options(options) {
      this.data = await this.$resource(options)
    }
  },
  computed: {
    title() {
      if (!this.$route.path) return null
      const type = this.$route.path.replace(/^\/search\//, '')
      return `Search ${type} for "${decodeURIComponent(this.$route.query.q)}"`
    }
  }
}
