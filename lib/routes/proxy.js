const pnut = require('pnut-butter')

module.exports = async ctx => {
  const { method, state, params, query, request } = ctx
  if (state.user) {
    pnut.token = state.user.token
    const resource = `/${params[0]}`
    const body = method.toLowerCase() === 'get'
      ? query
      : request.body
    const url = resource + request.search
    ctx.body = await pnut.custom(url, method, body)
      .then(res => {
        return res
      }).catch(err => {
        console.error(err)
      })
  }
  // ctx.body = 'hello'
}
