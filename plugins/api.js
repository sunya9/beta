export default async (ctx, opts) => {
  if (typeof opts === 'string') {
    opts = {
      resource: opts
    }
  }
  if (!ctx) ctx = {}
  const { method = 'get', resource, body } = opts
  if (!ctx.req) {
    const axios = require('axios')
    const { data } = await axios[method](`/proxy${resource}`, body)
    return data
  } else {
    const pnut = require('pnut-butter')
    pnut.token = ctx.req.user.token
    return await pnut.custom(resource, method, body)
  }
}
