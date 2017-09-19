const auth = require('./routes/auth')
const proxy = require('./routes/proxy')
const Router = require('koa-router')
module.exports = app => {
  const router = new Router()
  router.get('/login', auth.login)
  router.get('/auth/callback', auth.callback)
  router.get('/logout', auth.logout)
  router.all('/proxy/(.*)', proxy)

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
