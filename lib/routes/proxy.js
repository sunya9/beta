const pnut = require('pnut-butter')
const FormData = require('form-data')
const fetch = require('node-fetch')
const asyncBusboy = require('async-busboy')

module.exports = async ctx => {
  const { method, state, params, query, request } = ctx
  try {
    if (state.user && state.user.token) {
      pnut.token = state.user.token
    } else {
      pnut.token = null
      throw new Error()
    }
    const resource = `/${params[0]}`
    const body = method.toLowerCase() === 'get' ? query : request.body
    const url = encodeURI(resource) + request.search
    const res = !ctx.is('multipart/form-data')
      ? await pnut.custom(url, method, body)
      : // dirty hack for form-data
        await (async () => {
          const { files: [file], fields } = await asyncBusboy(ctx.req)
          const body = createFileBody(file, fields)
          const res = await fetch(`https://api.pnut.io/v0${url}`, {
            method,
            body,
            headers: {
              Authorization: `bearer ${pnut.token}`
            }
          }).then(res => res.json())
          return res
        })()
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

function createFileBody(file, obj) {
  const fd = Object.keys(obj).reduce((fd, key) => {
    fd.append(key, obj[key])
    return fd
  }, new FormData())
  fd.append(file.fieldname, file)
  return fd
}
