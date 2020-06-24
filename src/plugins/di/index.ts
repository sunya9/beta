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

type InteractorType = Pick<Interactors, keyof Interactors>

export default plugin

declare module 'vue/types/vue' {
  interface Vue {
    $interactors: InteractorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $interactors: InteractorType
  }
}
