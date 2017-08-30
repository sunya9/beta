import qs from 'querystring'

class API {
  constructor (ctx) {
    this.fetch = this.fetch.bind(this)
    this.request = this.request.bind(this)
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
    this.delete = this.delete.bind(this)
    this.patch = this.patch.bind(this)
    this._token = ''
    this.isServer = ctx.isServer
    if (ctx.route) {
      this.resource = API.RESOURCE_MAP[ctx.route.name]
      if (typeof this.resource === 'function') {
        this.resource = this.resource(ctx.route.params)
      }
    }
  }

  async fetch (option = {}) {
    const res = await this.get(this.resource, option)
    return res
  }

  async get (resource, body) {
    const defaults = {
      include_post_raw: 1,
      include_directed_posts: 0
    }
    const queryObj = Object.assign({}, defaults, body)
    const params = qs.stringify(queryObj)
    const url = `${resource}?${params}`
    const res = await this.request(url)
    return res
  }

  async post (resource, body) {
    const res = await this.request(resource, 'post', body)
    return res
  }

  async delete (resource, body) {
    const res = await this.request(resource, 'delete', body)
    return res
  }

  async patch (resource, body) {
    const res = await this.request(resource, 'patch', body)
    return res
  }
}

API.RESOURCE_MAP = {
  index: '/posts/streams/me',
  mentions: '/users/me/mentions',
  interactions: '/users/me/actions',
  stars: '/users/me/bookmarks',
  conversations: '/posts/streams/explore/conversations',
  'missed-conversations': '/posts/streams/explore/missed_conversations',
  photos: '/posts/streams/explore/photos',
  trending: '/posts/streams/explore/trending',
  global: '/posts/streams/global',
  'posts-id': params => `/posts/${params.id}/thread`,
  'tags-name': params => `/posts/tag/${encodeURIComponent(params.name)}`,
  '@name': params => `/users/@${params.name}/posts`,
  '@name-follows': params => `/users/@${params.name}/following`,
  '@name-followers': params => `/users/@${params.name}/followers`,
  '@name-starred': params => `/users/@${params.name}/bookmarks`,
  '@name-posts-id': params => `/posts/${params.id}/thread`
}

class PnutAPI extends API {
  constructor (ctx) {
    super(ctx)
    if (ctx.req.user && ctx.req.user.token) {
      this._token = ctx.req.user.token
    }
    this.request = this.request.bind(this)
  }

  async request (resource, method = 'get', body = {}) {
    const pnut = require('pnut-butter')
    pnut.token = this._token
    const data = await pnut.custom(resource, method, body)
    return data
  }
}

class AxiosAPI extends API {
  constructor (ctx) {
    super(ctx)
    this.request = this.request.bind(this)
  }

  async request (resource, method = 'get', body = {}) {
    const axios = require('axios')
    resource = resource.replace(/^\/proxy/, '')
    resource = `/proxy${resource}`
    const { data } = await axios[method](resource, body)
    return data
  }
}

export default (ctx = {}) => process.SERVER_BUILD
  ? new PnutAPI(ctx)
  : new AxiosAPI(ctx)
