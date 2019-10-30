import { Raw } from '~/models/raw'
import { ReplacementFile } from '~/models/raw/replacement-values/file'

export type ChannelCoverImage = Raw<ChannelCoverImage.Value>

export namespace ChannelCoverImage {
  export const type = 'io.pnut.core.channel.cover'
  interface Value {
    '+io.pnut.core.file': ReplacementFile;
  }
}
