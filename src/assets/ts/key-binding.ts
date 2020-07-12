import Vue from 'vue'

type KeyMap = Record<string, string>

// FIXME
function hasFunction(
  vue: Vue,
  method: string
): vue is Vue & { [key: string]: () => void } {
  return method in vue
}

const defaultMixin = (keyMap: KeyMap) =>
  Vue.extend({
    async mounted() {
      await this.$nextTick()
      Object.keys(keyMap).forEach((key) =>
        this.$mousetrap.bind(key, () => {
          const method = keyMap[key]
          if (hasFunction(this, method)) this[method]()
          else this.$emit(method)
        })
      )
    },
    beforeDestroy() {
      Object.keys(keyMap).forEach((key) => this.$mousetrap.unbind(key))
    },
  })

export default defaultMixin

export const forList = (keyMap: KeyMap, selector?: string) =>
  Vue.extend({
    data() {
      return {
        select: -1,
      }
    },
    async mounted() {
      await this.$nextTick()
      const keys = Object.keys(keyMap)
      keys.forEach((key) => {
        const method = keyMap[key]
        this.$on(method, () => {
          if (this.select < 0 || !this.$el || !this.$el.children) return
          const el = selector
            ? this.$el.querySelector(selector)
            : this.$el.firstChild
          // @ts-ignore
          el.children[this.select].__vue__[method]()
        })
        this.$once('hook:beforeDestroy', () => this.$off(method))
      })
    },
  })
