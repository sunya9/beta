if (process.BROWSER_BUILD) {
  const Mousetrap = require('mousetrap')
  require('mousetrap/plugins/pause/mousetrap-pause')
  module.exports = Mousetrap
}
