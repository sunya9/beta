import { Raw } from '~/models/raw'
import { ReplacementFile } from '~/models/raw/replacement-values/file'

export type ChannelAvatarImage = Raw<ChannelAvatarImage.Value>

export namespace ChannelAvatarImage {
  export const type = 'io.pnut.core.channel.avatar'
  interface Value {
    '+io.pnut.core.file': ReplacementFile;
  }
}
