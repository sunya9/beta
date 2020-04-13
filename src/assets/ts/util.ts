import _ from 'lodash'
import { Entity } from '~/models/entity'
import { Raw, HasRaw } from '~/models/raw'
import { Post } from '~/models/post'
import { OEmbed } from '~/models/raw/raw/oembed'
import { Channel } from '~/models/channel'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'
import { LongPost } from '~/models/raw/raw/long-post'
import { Crosspost } from '~/models/raw/raw/crosspost'
import { ChannelInvite } from '~/models/raw/raw/channel-invite'
import { User } from '~/models/user'
import { Message } from '~/models/message'

const imgExt = /\.(png|gif|jpe?g|bmp|svg)$/

export function getTitle({
  username,
  name,
}: {
  username: string
  name: string
}): string {
  return name ? `${name} (@${username})` : `@${username}`
}

function getImagesFromLinks(entityLinks: Entity.Link[]) {
  return entityLinks
    .filter((link) => imgExt.test(link.link))
    .map((link) => {
      return {
        original: link.link,
        thumb: link.link,
      }
    })
}

function rawIsOembed(raw: Raw<any>): raw is OEmbed<any> {
  return raw.type === OEmbed.type
}

function oEmbedIsPhoto(
  oembed: OEmbed<any>
): oembed is OEmbed<OEmbed.PhotoValue> {
  return oembed.value.type === 'photo'
}

// TODO
export interface PhotoValueForView extends OEmbed.PhotoValue {
  original: string
  thumb: string
  width: number
  height: number
}
function getImagesFromRaws(raws: Raw<any>[]): PhotoValueForView[] {
  return raws
    .filter(rawIsOembed)
    .filter(oEmbedIsPhoto)
    .map<PhotoValueForView>((r) => ({
      ...r.value,
      original: r.value.url,
      thumb: r.value.thumbnail_url || r.value.url,
      width: r.value.width,
      height: r.value.height,
    }))
}

export interface ImageForView {
  thumb: string
  original: string
  width: number
  height: number
}
export function getImageURLs(
  post: HasRaw & (Post | Message),
  rawOnly = false
): ImageForView[] {
  if (!post.content) return []
  const photos: ImageForView[] = []
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

function rawIsCrosspost(raw: Raw<any>): raw is Crosspost {
  return raw.type === Crosspost.type
}

export function getCrosspostLink(
  post: HasRaw & (Post | Message)
): string | void {
  if (!post.content || !post.raw) return
  const crosspost = post.raw.find(rawIsCrosspost)
  if (!crosspost) return
  return crosspost.value.canonical_url
}

export function getSpoiler(hasRaw: HasRaw | void): Spoiler.Value | void {
  if (!hasRaw || !hasRaw.raw) return
  const spoilerRaw = hasRaw.raw.find((r) => {
    return (
      r.type === 'shawn.spoiler' &&
      r.value.topic &&
      (!r.value.expired_at || new Date(r.value.expired_at) > new Date())
    )
  })
  if (!spoilerRaw) return
  return {
    topic: spoilerRaw.value.topic,
  }
}

function rawIsLongPost(raw: Raw<any>): raw is LongPost {
  return raw.type === LongPost.type
}

export type LongPostValueForView = Pick<LongPost.Value, 'body' | 'title'>
export function getLongpost(
  post: HasRaw & (Post | Message)
): LongPostValueForView | void {
  if (!post.content) return
  if (!post.raw) return
  const longpost = post.raw.find(rawIsLongPost)
  if (!longpost) return
  return {
    body: longpost.value.body,
    title:
      longpost.value.title &&
      longpost.value.title !==
        longpost.value.body.substr(0, longpost.value.title.length)
        ? longpost.value.title
        : '',
  }
}

export interface AudioForView {
  url: string
  title: string
}

function oembedIsAudio(
  oembed: OEmbed<any>
): oembed is OEmbed<OEmbed.AudioValue> {
  return oembed.value.type === 'audio'
}
export function getAudio(hasRawData: HasRaw): AudioForView[] | void {
  if (!hasRawData.raw) return
  const audio = hasRawData.raw
    .filter(rawIsOembed)
    .filter(oembedIsAudio)
    .map((r) => {
      return {
        url: r.value.url,
        title: r.value.title,
      }
    })
  return audio
}

function rawIsOembedVideo(
  oembed: OEmbed<any>
): oembed is OEmbed<OEmbed.VideoValue> {
  return oembed.value.type === 'video'
}

export function getOembedVideo(post: HasRaw & (Post | Message)) {
  if (!post.content) return []
  if (!post.raw) return []
  return post.raw
    .filter(rawIsOembed)
    .filter(rawIsOembedVideo)
    .map((r) => r.value)
}

function rawIsChannelInvite(raw: Raw<any>): raw is ChannelInvite {
  return raw.type === ChannelInvite.type
}

export interface ChannelInviteForView extends ChannelInvite.Value {
  display_name: string
}
export function getChannelInvite(
  post: HasRaw & (Post | Message)
): ChannelInviteForView | void {
  if (!post || !post.content || !post.raw) return
  const channelRaw = post.raw.find(rawIsChannelInvite)
  if (!channelRaw) return
  return {
    ...channelRaw.value,
    display_name:
      channelRaw.value.name || `Channel ${channelRaw.value.channel_id}`,
  }
}

export function getRSSLink(href: string) {
  return {
    hid: 'rss',
    rel: 'alternate',
    type: 'application/rss+xml',
    href,
  }
}

export function findChatRaw(channel: Channel): ChatRoomSettings | void {
  if (!channel.raw) return
  const chatRaw = channel.raw.find(
    (r) => r.type === 'io.pnut.core.chat-settings'
  )
  if (!chatRaw) return
  return chatRaw
}

export function findChatValueRaw(
  channel: Channel
): ChatRoomSettings.Value | void {
  if (!channel.raw) return
  const chatRaw = channel.raw.find(
    (r) => r.type === 'io.pnut.core.chat-settings'
  )
  if (!chatRaw) return
  return chatRaw.value
}

export interface MinimumUser
  extends Required<Pick<User, 'id' | 'name' | 'username'>> {
  content?: {
    avatar_image: {
      link: string
    }
  }
}

export const deletedUser: MinimumUser = {
  id: '',
  name: '',
  username: 'Deleted user',
  content: {
    avatar_image: {
      link: '',
    },
  },
}

const iframeVideoProviderRegexpList = [/^https:\/\/www\.youtube\.com\/embed\//]

export function getVideoSrcFromHtml(html: string) {
  const matcher = html.match(/src="([^"]*)"/)
  if (!matcher) return
  return matcher[1]
}

export function determineVideoType(src: string) {
  const found = iframeVideoProviderRegexpList.find((regex) => regex.test(src))
  if (found) return 'iframe'
  return 'video'
}
