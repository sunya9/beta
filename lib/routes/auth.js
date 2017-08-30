const passport = require('koa-passport')

class Auth {
  static logout (ctx) {
    ctx.logout()
    ctx.redirect('/')
  }

  static async callback (ctx) {
    await passport.authenticate('pnut', {
      successRedirect: '/',
      failureRedirect: '/'
    })(ctx)
  }
}

Auth.login = passport.authenticate('pnut', {
  scope: 'stream messages write_post follow update_profile files'
})

module.exports = Auth
