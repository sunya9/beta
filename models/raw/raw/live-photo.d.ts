import { Raw } from '~/models/raw'

export type LivePhoto = Raw<LivePhoto.Value>

export namespace LivePhoto {
  export const type = 'com.hutattedonmyarm.livephoto'
  interface Value {
    version: string;
    width?: string;
    height: string;

    photo_url: string;
    video_url: string;

    title?: string;
  }
}
