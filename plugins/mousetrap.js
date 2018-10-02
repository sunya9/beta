import Mousetrap from 'mousetrap'
require('imports-loader?Mousetrap=>require("mousetrap")!mousetrap/plugins/pause/mousetrap-pause') // eslint-disable-line

// if (process.browser) {

//   module.exports = {
//     pause() {
//       Mousetrap.pause() // eslint-disable-line
//     },
//     unpause() {
//       Mousetrap.unpause() // eslint-disable-line
//     },
//     bind(...args) {
//       Mousetrap.bind(...args) // eslint-disable-line
//     },
//     unbind(...args) {
//       Mousetrap.unbind(...args) // eslint-disable-line
//     }
//   }
// }

export default (app, inject) => {
  inject('mousetrap', Mousetrap)
}
