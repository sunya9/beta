export default {
  computed: {
    title () {
      if (!this.$route.path) return null
      const type = this.$route.path.replace(/^\/search\//, '')
      return `Search ${type} for "${decodeURIComponent(this.$route.query.q)}"`
    }
  }
}
