declare module '*.vue' {
  import Vue, { VueConstructor } from 'vue'
  const vue: VueConstructor<Vue>
  export default vue
}
