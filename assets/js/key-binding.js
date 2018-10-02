export default {
  async mounted() {
    await this.$nextTick()
    Object.keys(this.$options.keyMaps).forEach(key =>
      this.$mousetrap.bind(key, () => {
        const method = this.$options.keyMaps[key]
        if (method in this) this[method]()
        else this.$emit(method)
      })
    )
  },
  beforeDestroy() {
    Object.keys(this.$options.keyMaps).forEach(key =>
      this.$mousetrap.unbind(key)
    )
  }
}

export const forList = {
  data() {
    return {
      select: -1
    }
  },
  async mounted() {
    await this.$nextTick()
    const keys = Object.keys(this.$options.keyMaps)
    keys.forEach(key => {
      const method = this.$options.keyMaps[key]
      this.$on(method, () => {
        if (this.select < 0) return
        this.$el.children[this.select].firstChild.__vue__[method]()
      })
      this.$once('hook:beforeDestroy', () => this.$off(method))
    })
  }
}
