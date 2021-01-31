import Vue from 'vue'
import { KeyMap } from '~/assets/ts/key-binding'

// FIXME
function hasFunction(
  vue: Vue,
  method: string
): vue is Vue & { [key: string]: () => void } {
  return method in vue
}
export const defaultMixin = (keyMap: KeyMap) =>
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
