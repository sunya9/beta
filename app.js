require('dotenv').config()

const Koa = require('koa')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const router = require('./lib/router')
const passport = require('./lib/passport')
const app = new Koa()
const { Nuxt, Builder } = require('nuxt')

const config = require('./nuxt.config.js')
config.dev = !(app.env === 'production')
const test = app.env === 'test'

app.keys = [config.dev ? 'beta' : process.env.SALT]
const sessionConfig = {
  maxAge: 1000 * 60 * 60 * 24 * 30
}

// error handling should be first middleware
// https://github.com/koajs/koa/wiki/Error-Handling
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (e) {
    ctx.body = {
      message: e.message
    }
    ctx.status = e.status || 500
    ctx.app.emit('error', e, ctx)
  }
})

app.use(bodyParser({
  jsonLimit: '10mb'
}))
app.use(json())
app.use(session(sessionConfig, app))
passport(app)
router(app)

const nuxt = new Nuxt(config)

// Build only in dev mode
if (config.dev && !test) {
  const builder = new Builder(nuxt)
  builder.build()
    .catch((error) => {
      console.error(error) // eslint-disable-line no-console
      process.exit(1)
    })
}

app.use(async (ctx, next) => {
  await next()
  ctx.status = 200 // koa defaults to 404 when it sees that status is unset

  return new Promise((resolve, reject) => {
    ctx.res.on('close', resolve)
    ctx.res.on('finish', resolve)
    nuxt.render(ctx.req, ctx.res, promise => {
      // nuxt.render passes a rejected promise into callback on error.
      promise.then(resolve).catch(reject)
    })
  })
})

module.exports = app
