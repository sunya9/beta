import Mousetrap from 'mousetrap'
import { Plugin } from '@nuxt/types'
require('imports-loader?Mousetrap=>require("mousetrap")!mousetrap/plugins/pause/mousetrap-pause') // eslint-disable-line

const plugin: Plugin = (_, inject) => {
  inject('mousetrap', Mousetrap)
}

export default plugin
