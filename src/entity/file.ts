import { Client } from './client'
import { User } from './user'
import { ReplacementFileRaw } from '~/entity/raw/replacement-values/file'

export interface File {
  audio_info?: {
    duration: number
    duration_string: string
    bitrate: number
  }
  created_at: Date
  file_token: string
  file_token_read?: string
  id: string
  image_info?: {
    height: number
    width: number
  }
  video_info?: {
    bitrate: number
    duration: number
    duration_string: string
    height: number
    width: number
  }
  is_complete: boolean
  is_public: boolean
  kind: File.Kind
  link: string
  link_expires_at: Date
  link_short?: string
  mime_type?: string
  name: string
  sha256: string
  size: number
  source: Client.Source
  type: string
  upload_parameters?: {
    method: string
    url: string
  }
  derivative_files: {
    [key: string]: {
      link: string
      link_expires_at: string
      mime_type: string
      name: string
      sha256: string
      size: number
      image_info?: {
        height: number
        width: number
      }
    }
  }
  user?: User
}

export namespace File {
  export type Kind = 'audio' | 'image' | 'video' | 'other'
  export interface Replacement {
    '+io.pnut.core.file': {
      file_token: string
      format: 'oembed' // TODO: support metadata, url?
      file_id: string
    }
  }

  export function createFileReplacementRaw(
    file?: File
  ): ReplacementFileRaw | undefined {
    if (!file) return
    const { id: file_id, file_token } = file
    return {
      type: 'io.pnut.core.oembed',
      value: {
        '+io.pnut.core.file': {
          file_id,
          file_token,
          format: 'oembed',
        },
      },
    }
  }
}
