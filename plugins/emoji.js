// TODO: Fix dirty codeq
module.exports =
  process.browser || process.env.NODE_ENV === 'test'
    ? require('emoji-mart-vue')
    : {}
