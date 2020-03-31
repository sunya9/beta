import Vue from 'vue'
import moment from 'moment'
import { MousetrapInstance } from 'mousetrap'
import { Resource } from '~/plugins/axios/resources'

declare module 'vue/types/vue' {
  interface Vue {
    $resource: Resource
    $moment: typeof moment
    $mousetrap: MousetrapInstance
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $resource: Resource
    $moment: typeof moment
    $mousetrap: MousetrapInstance
  }
}
