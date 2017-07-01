const { OAuth2 } = require('oauth')
require('dotenv').config()
const request = require('request-promise')

class Imgur {
  static get oauth () {
    return new OAuth2(Imgur.clientId,
      Imgur.clientSecret,
      'https://api.imgur.com',
      '/oauth2/authorize',
      '/oauth2/token',
      null)
  }

  static async login (ctx) {
    const url = Imgur.oauth.getAuthorizeUrl({
      response_type: 'token'
    })
    ctx.redirect(url)
  }

  static get clientId () {
    return process.env.IMGUR_CLIENT_ID
  }

  static get clientSecret () {
    return process.env.IMGUR_CLIENT_SECRET
  }

  static async token (ctx) {
    const { body } = ctx.request
    const { refreshToken } = body
    if (!refreshToken) {
      return {
        meta: {
          code: 400,
          message: 'Require refresh token'
        }
      }
    }
    try {
      ctx.body = await request.post({
        url: 'https://api.imgur.com/oauth2/token',
        body: {
          refresh_token: refreshToken,
          client_id: Imgur.clientId,
          client_secret: Imgur.clientSecret,
          grant_type: 'refresh_token'
        },
        json: true
      })
    } catch (e) {
      ctx.body = {
        meta: {
          code: 400,
          message: e.message
        }
      }
    }
  }

  static async post (ctx) {
    const { body } = ctx.request
    const { token, images, title } = body
    const uploadPromises = images.map(image => {
      return new Promise((resolve, reject) => {
        request.post({
          url: 'https://api.imgur.com/3/image',
          headers: {
            Authorization: `Bearer ${token.access_token}`
          },
          body: {
            title,
            image
          },
          json: true
        }).then(resolve).catch(reject)
      })
    })
    try {
      ctx.body = await Promise.all(uploadPromises)
        .then(images => {
          const urls = images.map(image => {
            const { link: url, width, height, title } = image.data
            return {
              url, width, height, title
            }
          })
          return urls
        })
    } catch (err) {
      const { statusCode, error: { data: { error: message } } } = err
      ctx.throw(statusCode, message)
    }
    // e.g.
    // { id: 'NGY2ukV',
    //  title: null,
    //  description: null,
    //  datetime: 1493536489,
    //  type: 'image/png',
    //  animated: false,
    //  width: 627,
    //  height: 430,
    //  size: 58169,
    //  views: 0,
    //  bandwidth: 0,
    //  vote: null,
    //  favorite: false,
    //  nsfw: null,
    //  section: null,
    //  account_url: null,
    //  account_id: 57253893,
    //  is_ad: false,
    //  tags: [],
    //  in_most_viral: false,
    //  in_gallery: false,
    //  deletehash: 'IgNzyvDLlMUJpp0',
    //  name: '',
    //  link: 'http://i.imgur.com/NGY2ukV.png' }
  }
}

module.exports = Imgur
