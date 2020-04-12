import { Raw } from '~/models/raw'

export type OEmbed<T extends OEmbed.BaseValue> = Raw<T>

export namespace OEmbed {
  export const type = 'io.pnut.core.oembed'
  export type MediaType = 'photo' | 'video' | 'rich' | 'html5video' | 'audio'
  // TODO
  interface VisualContent {
    width: number
    height: number
  }
  interface HaveHTML {
    html: string
  }
  export interface BaseValue {
    version: string
    type: MediaType
    title: string
    url: string
    author_name: string
    author_url: string
    provider_name: string
    provider_url: string
    embeddable_url: string
  }

  export interface PhotoValue extends BaseValue, VisualContent {
    type: 'photo'
    thumbnail_url?: string
  }
  export interface VideoValue extends BaseValue, VisualContent, HaveHTML {
    type: 'video'
  }
  export interface HTML5Video extends BaseValue, VisualContent {
    type: 'html5video'
    sources: {
      type: string
      url: string
    }[]
    poster_url: string
  }
  export interface AudioValue extends BaseValue {
    type: 'audio'
    file_id: string
    file_token_read: string
    url_expires_at: Date
  }

  // TBD
  export interface RichValue extends BaseValue, HaveHTML {
    type: 'rich'
    description: string
  }
}
