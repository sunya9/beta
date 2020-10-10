import dayjs from 'dayjs'
import Mousetrap from 'mousetrap'
import { Interactors } from '~/plugins/di/interactors'
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $dayjs: typeof dayjs
    $mousetrap: typeof Mousetrap
    $accessor: typeof accessorType
    $_uid: number
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $dayjs: typeof dayjs
    $mousetrap: typeof Mousetrap
    $accessor: typeof accessorType
  }
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]> | null
    }
  : T

declare module 'vuex/types/index' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Store<S> {
    $interactors: Interactors
  }
}
