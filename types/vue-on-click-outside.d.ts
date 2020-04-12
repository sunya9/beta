declare module 'vue-on-click-outside' {
  import { DirectiveFunction } from 'vue'
  export const directive: {
    bind: DirectiveFunction
    unbind: DirectiveFunction
    update: DirectiveFunction
  }
}
