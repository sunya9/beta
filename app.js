require('dotenv').config()

const Koa = require('koa')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const json = require('koa-json')
const router = require('./lib/router')
const passport = require('./lib/passport')
const app = new Koa()
const Nuxt = require('nuxt')

const config = require('./nuxt.config.js')
config.dev = !(app.env === 'production')

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
if (config.dev) {
  nuxt.build()
    .catch((error) => {
      console.error(error) // eslint-disable-line no-console
      process.exit(1)
    })
}

// https://ja.nuxtjs.org/api/nuxt-render
app.use(async (ctx, next) => {
  ctx.status = 200 // koa defaults to 404 when it sees that status is unset
  try {
    await nuxt.render(ctx.req, ctx.res)
  } catch (e) {
    console.error(e)
  }
})

app.listen(3000)
