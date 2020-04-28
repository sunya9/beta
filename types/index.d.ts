import Vue from 'vue'
import dayjs from 'dayjs'
import Mousetrap from 'mousetrap'
import { Resource } from '~/plugins/axios/resources'
import { accessorType } from '~/store'

declare module 'vue/types/vue' {
  interface Vue {
    $resource: Resource
    $dayjs: typeof dayjs
    $mousetrap: typeof Mousetrap
    $accessor: typeof accessorType
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $resource: Resource
    $dayjs: typeof dayjs
    $mousetrap: typeof Mousetrap
    $accessor: typeof accessorType
  }
}
