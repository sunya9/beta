import Mousetrap from 'mousetrap'
require('imports-loader?Mousetrap=>require("mousetrap")!mousetrap/plugins/pause/mousetrap-pause') // eslint-disable-line

export default (_, inject) => {
  inject('mousetrap', Mousetrap)
}
