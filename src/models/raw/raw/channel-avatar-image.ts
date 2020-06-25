import { BaseRaw } from '~/models/raw'
import { ReplacementFile } from '~/models/raw/replacement-values/file'

export namespace ChannelAvatarImage {
  export const type = 'io.pnut.core.channel.avatar' as const
  export interface Value {
    '+io.pnut.core.file': ReplacementFile
  }
}

export interface ChannelAvatarImage extends BaseRaw {
  type: typeof ChannelAvatarImage.type
  value: ChannelAvatarImage.Value
}
