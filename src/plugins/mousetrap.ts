import Mousetrap from 'mousetrap'
import { Plugin } from '@nuxt/types'
require('imports-loader?imports=default|mousetrap|Mousetrap!mousetrap/plugins/pause/mousetrap-pause') // eslint-disable-line

const plugin: Plugin = (_, inject) => {
  inject('mousetrap', Mousetrap)
}

declare module 'mousetrap' {
  export interface MousetrapStatic {
    pause(): void
    unpause(): void
  }
}

export default plugin
