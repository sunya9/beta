import { BaseRaw } from '~/models/raw'

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
      type: 'photo'
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
      type: 'video'
    }
  }

  export interface HTML5Video extends BaseOEmbed {
    value: HTML5Video.Value
  }

  export namespace HTML5Video {
    export interface Value extends BaseOEmbed.BaseValue, VisualContent {
      type: 'html5video'
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
      type: 'audio'
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
      type: 'rich'
      description: string
    }
  }
}

export type OEmbed =
  | OEmbed.Audio
  | OEmbed.HTML5Video
  | OEmbed.Photo
  | OEmbed.Rich
  | OEmbed.Video

export interface BaseOEmbed extends BaseRaw {
  type: typeof OEmbed.type
  value: BaseOEmbed.BaseValue
}

export namespace BaseOEmbed {
  export type MediaType = 'photo' | 'video' | 'rich' | 'html5video' | 'audio'
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
