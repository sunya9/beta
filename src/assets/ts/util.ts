import _ from 'lodash'
import { Entity } from '~/entity/entity'
import { Raw, HasRaw } from '~/entity/raw'
import { Post } from '~/entity/post'
import { OEmbed } from '~/entity/raw/raw/oembed'
import { User } from '~/entity/user'
import { Message } from '~/entity/message'

function rawIsOembed(raw: Raw): raw is OEmbed {
  return raw.type === OEmbed.type
}

function oEmbedIsPhoto(oembed: OEmbed): oembed is OEmbed.Photo {
  return oembed.value.type === 'photo'
}

// TODO
export interface PhotoValueForView extends OEmbed.Photo.Value {
  original: string
  thumb: string
  width: number
  height: number
}
function getImagesFromRaws(raws: Raw[]): PhotoValueForView[] {
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
  post: HasRaw & Entity.HaveEntityWrapper,
  rawOnly = false
): ImageForView[] {
  if (!post.content) return []
  const photos: ImageForView[] = []
  if (post.raw) {
    const embedPhotos = getImagesFromRaws(post.raw)
    Array.prototype.push.apply(photos, embedPhotos)
  }
  if (!rawOnly) {
    const linkPhotos = Entity.getImagesFromLinks(post.content.entities.links)
    Array.prototype.push.apply(photos, linkPhotos)
  }
  return _.uniqBy(photos, 'original')
}

export interface AudioForView {
  url: string
  title: string
}

function oembedIsAudio(oembed: OEmbed): oembed is OEmbed.Audio {
  return oembed.value.type === 'audio'
}
export function getAudio(hasRawData: HasRaw): AudioForView[] | void {
  if (!hasRawData.raw) return
  const audio = hasRawData.raw
    .filter(rawIsOembed)
    .filter(oembedIsAudio)
    .map((r) => {
      return {
        url: r.value.url!,
        title: r.value.title!,
      }
    })
  return audio
}

function rawIsOembedVideo(oembed: OEmbed): oembed is OEmbed.Video {
  return oembed.value.type === 'video'
}

export function getOembedVideo(
  post: HasRaw & (Post | Message)
): OEmbed.Video.Value[] {
  return (
    post.raw
      ?.filter(rawIsOembed)
      .filter(rawIsOembedVideo)
      .map((r) => r.value) || []
  )
}

export function getRSSLink(href: string) {
  return {
    hid: 'rss',
    rel: 'alternate',
    type: 'application/rss+xml',
    href,
  }
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

const failedToCaptureError = new Error('Failed to thumbnail from video')
export async function getVideoThumbURL(objectURL: string): Promise<string> {
  const videoEl = document.createElement('video')
  const sourceEl = document.createElement('source')
  sourceEl.src = objectURL
  videoEl.autoplay = true
  videoEl.currentTime = 0.5
  videoEl.appendChild(sourceEl)

  const canvasEl = document.createElement('canvas')
  await new Promise((resolve, reject) => {
    videoEl.addEventListener('loadeddata', resolve)
    videoEl.addEventListener('error', reject)
    videoEl.addEventListener('abort', reject)
  })
  canvasEl.width = videoEl.videoWidth
  canvasEl.height = videoEl.videoHeight
  const ctx = canvasEl.getContext('2d')
  if (!ctx) throw failedToCaptureError
  ctx.drawImage(videoEl, 0, 0, videoEl.videoWidth, videoEl.videoHeight)
  const blob = await new Promise<Blob | null>((resolve) => {
    canvasEl.toBlob(resolve, 'image/png')
  })
  if (!blob) throw failedToCaptureError
  return URL.createObjectURL(blob)
}
