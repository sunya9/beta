const pnut = require('pnut-butter')

module.exports = async ctx => {
  const { method, state, params, query, request } = ctx
  if (state.user) {
    pnut.token = state.user.token
    const url = `/${params[0]}`
    const body = method.toLowerCase() === 'get'
      ? query
      : request.body
    console.log(params)
    await pnut.personal()
    ctx.body = await pnut.custom(url, method, body)
      .then(res => {
        // console.log(res)
        return res
      }).catch(err => {
        console.error(err)
      })
  }
  // ctx.body = 'hello'
}
