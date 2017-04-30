const { OAuth2 } = require('oauth')
require('dotenv').config()
const request = require('request-promise')

class Imgur {
  static get oauth () {
    const {
      IMGUR_CLIENT_ID,
      IMGUR_CLIENT_SECRET
    } = process.env
    return new OAuth2(IMGUR_CLIENT_ID,
      IMGUR_CLIENT_SECRET,
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
