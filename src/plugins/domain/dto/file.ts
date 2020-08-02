import { File } from '~/entity/file'

export type GeneralFileParameters = {
  include_incomplete?: boolean
  include_private?: boolean
  mime_types?: string[]
  file_types?: string[]
  exclude_file_types?: string[]
  include_raw?: boolean
  include_file_raw?: boolean
}

export type PostFileRequest = {
  content: Blob
  type: string
  name?: string
  kind?: File.Kind
  is_public: boolean
  sha_256?: string
  mime_type?: string
  // TODO: {name} + _image_thumb_200s, {name} + _image_thumb_960r
  process_image_exif?: boolean
}

export type FileIdRequest = { file_id: string }
