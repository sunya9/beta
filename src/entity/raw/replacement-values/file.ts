import { BaseRaw } from '~/entity/raw'
import { OEmbed } from '~/entity/raw/raw/oembed'
export interface ReplacementFile {
  file_token: string
  format: 'oembed'
  file_id: string
}

export namespace ReplacementFile {
  export const key = '+io.pnut.core.file' as const
}

export interface ReplacementFileRaw extends BaseRaw {
  type: typeof OEmbed.type
  value: {
    [ReplacementFile.key]: ReplacementFile
  }
}
