import Vue from 'vue'

type KeyMap = { [key: string]: string }

export default (keyMap: KeyMap) =>
  Vue.extend({
    async mounted() {
      await this.$nextTick()
      Object.keys(keyMap).forEach(key =>
        this.$mousetrap.bind(key, () => {
          const method = keyMap[key]
          // if (method in this) this[method]()
          // else this.$emit(method)
          this.$emit(method)
        })
      )
    },
    beforeDestroy() {
      Object.keys(keyMap).forEach(key => this.$mousetrap.unbind(key))
    }
  })

export const forList = (keyMap: KeyMap) =>
  Vue.extend({
    data() {
      return {
        select: -1
      }
    },
    async mounted() {
      await this.$nextTick()
      const keys = Object.keys(keyMap)
      keys.forEach(key => {
        const method = keyMap[key]
        this.$on(method, () => {
          if (this.select < 0 || !this.$el) return
          this.$el.children[this.select].firstChild.__vue__[method]()
        })
        this.$once('hook:beforeDestroy', () => this.$off(method))
      })
    }
  })
