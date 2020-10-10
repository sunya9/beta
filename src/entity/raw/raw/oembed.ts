import { BaseRaw } from '~/entity/raw'

export namespace BaseOEmbed {
  export namespace MediaType {
    export const photo = 'photo' as const
    export type photo = typeof photo
    export const video = 'video' as const
    export type video = typeof video
    export const rich = 'rich' as const
    export type rich = typeof rich
    export const html5video = 'html5video' as const
    export type html5video = typeof html5video
    export const audio = 'audio' as const
    export type audio = typeof audio
  }
  export type MediaType =
    | MediaType.photo
    | MediaType.video
    | MediaType.rich
    | MediaType.html5video
    | MediaType.audio
  export interface BaseValue {
    version: '1.0'
    type: MediaType
    title?: string
    url?: string
    author_name?: string
    author_url?: string
    provider_name?: string
    provider_url?: string
    embeddable_url?: string
  }
}

export namespace OEmbed {
  export const type = 'io.pnut.core.oembed' as const
  // TODO
  interface VisualContent {
    width: number
    height: number
  }
  interface HaveHTML {
    html: string
  }

  export interface Photo extends BaseOEmbed {
    value: Photo.Value
  }

  export namespace Photo {
    export interface Value extends BaseOEmbed.BaseValue, VisualContent {
      type: BaseOEmbed.MediaType.photo
      url: string
      thumbnail_url?: string
    }
  }

  export interface Video extends BaseOEmbed {
    value: Video.Value
  }

  export namespace Video {
    export interface Value
      extends BaseOEmbed.BaseValue,
        VisualContent,
        HaveHTML {
      type: BaseOEmbed.MediaType.video
    }
  }

  export interface HTML5Video extends BaseOEmbed {
    value: HTML5Video.Value
  }

  export namespace HTML5Video {
    export interface Value extends BaseOEmbed.BaseValue, VisualContent {
      type: BaseOEmbed.MediaType.html5video
      sources: {
        type: string
        url: string
      }[]
      poster_url: string
    }
  }

  export interface Audio extends BaseOEmbed {
    value: Audio.Value
  }

  export namespace Audio {
    export interface Value extends BaseOEmbed.BaseValue {
      type: BaseOEmbed.MediaType.audio
      file_id: string
      file_token_read: string
      url_expires_at: Date
    }
  }

  export interface Rich extends BaseOEmbed {
    value: Rich.Value
  }

  export namespace Rich {
    // TBD
    export interface Value extends BaseOEmbed.BaseValue, HaveHTML {
      type: BaseOEmbed.MediaType.rich
      description: string
    }
  }
}

export type OEmbedType =
  | OEmbed.Audio
  | OEmbed.HTML5Video
  | OEmbed.Photo
  | OEmbed.Rich
  | OEmbed.Video

export interface BaseOEmbed extends BaseRaw {
  type: typeof OEmbed.type
  value: BaseOEmbed.BaseValue
}
