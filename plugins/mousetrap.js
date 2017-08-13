if (process.BROWSER_BUILD) {
  require('imports-loader?Mousetrap=>require("mousetrap")!mousetrap/plugins/pause/mousetrap-pause') // eslint-disable-line

  module.exports = {
    pause () {
      Mousetrap.pause() // eslint-disable-line
    },
    unpause () {
      Mousetrap.unpause() // eslint-disable-line
    },
    bind (...args) {
      Mousetrap.bind(...args) // eslint-disable-line
    },
    unbind (...args) {
      Mousetrap.unbind(...args) // eslint-disable-line
    }
  }
}
