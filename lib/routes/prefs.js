const redis = require('ioredis')

module.exports = async ctx => {
  const { method, state, params, query, request } = ctx
  try {
    var client = new redis.Redis();
    var prefs = {'hide_directed_posts': state.hide_directed_posts, 'square_avatars': state.square_avatars, 'unified_timeline': state.unified_timeline};
    client.hmset("beta:user:" + state.user.id, prefs);
    ctx.status = 200;
    ctx.body = 'success'
    return 'success'
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