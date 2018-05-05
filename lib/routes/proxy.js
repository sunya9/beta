const FormData = require('form-data')
const fetch = require('node-fetch')
const asyncBusboy = require('async-busboy')

const ignoreMethodsRegExp = /GET|HEAD/i

module.exports = async ctx => {
  const { method, state, params, request } = ctx
  if (state.user && state.user.token) {
    const token = state.user.token
    const url = encodeURI(`/${params[0]}`) + request.search
    const body = ctx.is('multipart/form-data')
      ? await createFileBody(ctx.req)
      : ignoreMethodsRegExp.test(method) ? null : JSON.stringify(request.body)
    const headers = {
      Authorization: `bearer ${token}`
    }
    // ??
    if (!ctx.is('multipart/form-data')) {
      headers['Content-Type'] = 'application/json'
    }
    const resObj = await fetch(`https://api.pnut.io/v0${url}`, {
      method,
      body,
      headers
    })
    Array.from(resObj.headers.keys())
      .filter(key => key.startsWith('x-'))
      .forEach(key => ctx.set(key, resObj.headers.get(key)))
    const json = await resObj.json()
    ctx.status = json.meta.code
    ctx.body = json
  } else {
    ctx.status = 401
    ctx.body = {
      meta: {
        code: ctx.status,
        message: 'You have to login.'
      }
    }
  }
}

async function createFileBody(req) {
  const { files: [file], fields } = await asyncBusboy(req)
  const fd = Object.keys(fields).reduce((fd, key) => {
    fd.append(key, fields[key])
    return fd
  }, new FormData())
  fd.append(file.fieldname, file)
  return fd
}
