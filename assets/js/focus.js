export default {
  methods: {
    focus () {
      const { top, bottom } = this.$el.getBoundingClientRect()
      if (top < 70) {
        document.body.scrollTop -= 100
      } else if (window.innerHeight < bottom + 100) {
        document.body.scrollTop += 100
      }
    }
  }
}
