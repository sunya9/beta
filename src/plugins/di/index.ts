import 'reflect-metadata'
import { Plugin } from '@nuxt/types'
import { container } from 'tsyringe'
import { Interactors } from './interactors'
import { bind } from '~/plugins/di/bind'

const plugin: Plugin = (context, inject) => {
  bind(context)
  const interactors = container.resolve(Interactors)
  inject('interactors', interactors)
}

export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $interactors: Interactors
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $interactors: Interactors
  }
}

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface Store<S> {
    $interactors: Interactors
  }
}
