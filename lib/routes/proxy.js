const pnut = require('pnut-butter')

module.exports = async ctx => {
  const { method, state, params, query, request } = ctx
  try {
    if (state.user && state.user.token) {
      pnut.token = state.user.token
    }
    const resource = `/${params[0]}`
    const body = method.toLowerCase() === 'get'
      ? query
      : request.body
    const url = encodeURI(resource) + request.search
    const res = await pnut.custom(url, method, body)
      .catch(err => {
        console.error(err)
      })
    ctx.status = res.meta.code
    ctx.body = res
  } catch (e) {
    ctx.status = 401
    ctx.body = {
      meta: {
        code: ctx.status,
        message: 'You have to login.'
      }
    }
  }
}
