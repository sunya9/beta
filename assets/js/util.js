import _ from 'lodash'

export function getTitle({ username, name }) {
  return name ? `${name}(@${username})` : `@${username}`
}

export function getImageURLs(post, rawOnly = false) {
  if (!post.content) return []
  const imgExt = /\.(png|gif|jpe?g|bmp|svg)$/
  const photos = []
  if (post.raw) {
    const embedPhotos = post.raw
      .filter(r => {
        return r.type === 'io.pnut.core.oembed' && r.value.type === 'photo'
      })
      .map(r => {
        return {
          ...r.value,
          original: r.value.url,
          thumb: r.value.thumbnail_url || r.value.url,
          width: r.value.width,
          height: r.value.height
        }
      })
    Array.prototype.push.apply(photos, embedPhotos)
  }
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
  return _.uniqBy(photos, 'original')
}

export function getCrosspostLink(post) {
  if (!post.content || !post.raw) return false
  const canonical_link = post.raw.find(r => {
    return r.type === 'io.pnut.core.crosspost'
  })
  if (canonical_link) {
    return canonical_link.value.canonical_url
  }
}

export function getSpoiler(post) {
  if (!post.content) return {}
  if (!post.raw) return {}
  const spoiler = post.raw
    .filter(r => {
      return (
        r.type === 'shawn.spoiler' &&
        r.value.topic &&
        (!r.value.expired_at || new Date(r.value.expired_at) > new Date())
      )
    })
    .map(r => {
      return {
        topic: r.value.topic
      }
    })
  return spoiler[0]
}

export function getLongpost(post) {
  if (!post.content) return {}
  if (!post.raw) return {}
  const longpost = post.raw
    .filter(r => {
      return r.type === 'nl.chimpnut.blog.post' && r.value.body
    })
    .map(r => {
      return {
        body: r.value.body,
        title:
          r.value.title &&
          r.value.title != r.value.body.substr(0, r.value.title.length)
            ? r.value.title
            : false
      }
    })
  return longpost[0]
}

export function getAudio(post) {
  if (!post.content) return {}
  if (!post.raw) return {}
  const audio = post.raw
    .filter(r => {
      return r.type === 'io.pnut.core.oembed' && r.value.type === 'audio'
    })
    .map(r => {
      return {
        url: r.value.url,
        title: r.value.title
      }
    })
  return audio
}

export const underMessages = {
  computed: {
    underMessages() {
      return this.$route.name.startsWith('messages')
    }
  }
}

export function getRSSLink(href) {
  return {
    hid: 'rss',
    rel: 'alternate',
    type: 'application/rss+xml',
    href
  }
}
