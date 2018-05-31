const passport = require('koa-passport')
const { scope } = require('../util')

class Auth {
  static logout(ctx) {
    ctx.logout()
    ctx.redirect('/')
  }

  static async callback(ctx) {
    await passport.authenticate('pnut', {
      successRedirect: '/',
      failureRedirect: '/'
    })(ctx)
  }
}

Auth.login = passport.authenticate('pnut', { scope })

module.exports = Auth
