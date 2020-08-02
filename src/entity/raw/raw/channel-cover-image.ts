import { BaseRaw } from '~/entity/raw'
import { ReplacementFile } from '~/entity/raw/replacement-values/file'

export namespace ChannelCoverImage {
  export const type = 'io.pnut.core.channel.cover' as const
  export interface Value {
    '+io.pnut.core.file': ReplacementFile
  }
}

export interface ChannelCoverImage extends BaseRaw {
  type: typeof ChannelCoverImage.type
  value: ChannelCoverImage.Value
}
