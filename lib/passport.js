const passport = require('koa-passport')
const { Strategy } = require('passport-pnut')
const {
  CLIENT_ID: clientID,
  CLIENT_SECRET: clientSecret,
  CALLBACK_URI: callbackURL
} = process.env

module.exports = app => {
  passport.use(new Strategy({
    clientID,
    clientSecret,
    callbackURL
  }, (token, tokenSecret, profile, done) => {
    const { id, username } = profile
    const res = { id, username, token }
    done(null, res)
  }
  ))
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  passport.deserializeUser((user, done) => {
    done(null, user)
  })

  app.use(passport.initialize())
  app.use(passport.session())
}
