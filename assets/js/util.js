import _ from 'lodash'

export function getTitle({ username, name }) {
  return name ? `${name}(@${username})` : `@${username}`
}

export function getImageURLs(post, rawOnly = false) {
  if (!post.content) return []
  const imgExt = /\.(png|gif|jpe?g|bmp|svg)$/
  const photos = []
  if (!rawOnly) {
    const linkPhotos = post.content.entities.links
      .filter(link => imgExt.test(link.link))
      .map(link => {
        return {
          original: link.link,
          thumb: link.link
        }
      })
    Array.prototype.push.apply(photos, linkPhotos)
  }
  if (post.raw) {
    const embedPhotos = post.raw
      .filter(r => {
        return r.type === 'io.pnut.core.oembed' && r.value.type === 'photo'
      })
      .map(r => {
        return {
          ...r.value,
          original: r.value.url,
          thumb: r.value.url
        }
      })
    Array.prototype.push.apply(photos, embedPhotos)
  }
  return _.uniqBy(photos, 'original')
}
