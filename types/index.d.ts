import Vue from 'vue'
import dayjs from 'dayjs'
import Mousetrap from 'mousetrap'
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
