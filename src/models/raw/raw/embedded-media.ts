import { BaseRaw } from '~/models/raw'

export namespace EmbeddedMedia {
  export const type = 'io.pnut.core.oembed' as const
  // TODO
  export interface Value {
    version: string
    type: MediaType
    width: number
    height: number
    title: string
    url: string
    author_name: string
    author_url: string
    provider_name: string
    provider_url: string
    embeddable_url: string
    html: string
  }
  enum MediaType {
    photo,
    video,
    rich,
    html5video,
    audio,
  }
}

export interface EmbeddedMedia extends BaseRaw {
  type: typeof EmbeddedMedia.type
  value: EmbeddedMedia.Value
}
