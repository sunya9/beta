import { BaseRaw } from '~/models/raw'

export namespace LivePhoto {
  export const type = 'com.hutattedonmyarm.livephoto' as const
  export interface Value {
    version: string
    width?: string
    height: string

    photo_url: string
    video_url: string

    title?: string
  }
}

export interface LivePhoto extends BaseRaw {
  type: typeof LivePhoto.type
  value: LivePhoto.Value
}
