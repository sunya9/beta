import Vue from 'vue'
import { KeyMap } from '~/assets/ts/key-binding'

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
