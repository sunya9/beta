import _ from 'lodash'
import { Entity } from '~/models/entity'
import { Raw } from '~/models/raw'
import { Post } from '~/models/post'
import { EmbeddedMedia } from '~/models/raw/raw/embedded-media'
import { Channel } from '~/models/channel'

const imgExt = /\.(png|gif|jpe?g|bmp|svg)$/

export function getTitle({
  username,
  name
}: {
  username: string;
  name: string;
}): string {
  return name ? `${name} (@${username})` : `@${username}`
}

function getImagesFromLinks(entityLinks: Entity.Link[]) {
  return entityLinks
    .filter(link => imgExt.test(link.link))
    .map(link => {
      return {
        original: link.link,
        thumb: link.link
      }
    })
}

function isOembedType(raw: Raw<any>, type: string) {
  return raw.type === 'io.pnut.core.oembed' && raw.value.type === type
}

function getImagesFromRaws(raws: Raw<any>[]) {
  return raws
    .filter(r => isOembedType(r, 'photo'))
    .map(r => {
      return {
        ...r.value,
        original: r.value.url,
        thumb: r.value.thumbnail_url || r.value.url,
        width: r.value.width,
        height: r.value.height
      }
    })
}

export function getImageURLs(post: Post, rawOnly = false) {
  if (!post.content) return []
  const photos: Raw<EmbeddedMedia<any>>[] = []
  if (post.raw) {
    const embedPhotos = getImagesFromRaws(post.raw)
    Array.prototype.push.apply(photos, embedPhotos)
  }
  if (!rawOnly) {
    const linkPhotos = getImagesFromLinks(post.content.entities.links)
    Array.prototype.push.apply(photos, linkPhotos)
  }
  return _.uniqBy(photos, 'original')
}

export function getCrosspostLink(post: Post) {
  if (!post.content || !post.raw) return false
  const canonical_link = post.raw.find(r => {
    return r.type === 'io.pnut.core.crosspost'
  })
  if (canonical_link) {
    return canonical_link.value.canonical_url
  }
}

export function getSpoiler(post: Post) {
  if (!post.content || !post.raw) return null
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

export function getLongpost(post: Post) {
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
          r.value.title !== r.value.body.substr(0, r.value.title.length)
            ? r.value.title
            : false
      }
    })
  return longpost[0]
}

export function getAudio(post: Post) {
  if (!post.content) return {}
  if (!post.raw) return {}
  const audio = post.raw
    .filter(r => isOembedType(r, 'audio'))
    .map(r => {
      return {
        url: r.value.url,
        title: r.value.title
      }
    })
  return audio
}

export function getOembedVideo(post: Post) {
  if (!post.content) return []
  if (!post.raw) return []
  return post.raw.filter(r => isOembedType(r, 'video')).map(r => r.value)
}

export function getChannelInvite(post: Post) {
  if (!post || !post.content || !post.raw) return
  const channelRaw = post.raw.find(
    r => r.type === 'io.pnut.core.channel.invite'
  )
  if (!channelRaw) return
  channelRaw.value.display_name =
    channelRaw.value.name || `Channel ${channelRaw.value.channel_id}`
  return channelRaw.value
}

export function getRSSLink(href: string) {
  return {
    hid: 'rss',
    rel: 'alternate',
    type: 'application/rss+xml',
    href
  }
}

export function findChatRaw(channel: Channel, andValue = false) {
  if (!channel.raw) return
  const chatRaw = channel.raw.find(r => r.type === 'io.pnut.core.chat-settings')
  if (!chatRaw) return
  if (!andValue) return chatRaw
  return chatRaw.value
}

export const deletedUser = {
  id: '',
  name: '',
  username: 'Deleted user',
  content: {
    avatar_image: {
      link: ''
    }
  }
}

const iframeVideoProviderRegexpList = [/^https:\/\/www\.youtube\.com\/embed\//]

export function getVideoSrcFromHtml(html: string) {
  const matcher = html.match(/src="([^"]*)"/)
  if (!matcher) return
  return matcher[1]
}

export function determineVideoType(src: string) {
  const found = iframeVideoProviderRegexpList.find(regex => regex.test(src))
  if (found) return 'iframe'
  return 'video'
}
