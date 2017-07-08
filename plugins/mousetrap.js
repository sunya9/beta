if (process.BROWSER_BUILD) {
  require('imports-loader?Mousetrap=>require("mousetrap")!mousetrap/plugins/pause/mousetrap-pause')
}
