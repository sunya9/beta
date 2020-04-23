import { Raw } from '~/models/raw'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/models/pnut-response'
import { File as PnutFile } from '~/models/file'
import { Usecase } from '~/plugins/domain/usecases/usecase'

interface Input {
  photos: File[]
}
interface Output {
  raws: Raw<any>[]
}

function obj2FormData(obj: { [key: string]: string | Blob }) {
  return Object.keys(obj).reduce((fd, key) => {
    fd.append(key, obj[key])
    return fd
  }, new FormData())
}

function file2ReplacedRaw(fileRes: PnutResponse<PnutFile>) {
  const image = fileRes.data
  const value = {
    '+io.pnut.core.file': {
      file_id: image.id,
      file_token: image.file_token,
      format: 'oembed',
    },
  }
  return {
    type: 'io.pnut.core.oembed',
    value,
  }
}

export interface UploadPhotosUseCase extends Usecase<Input, Promise<Output>> {}

export class UploadPhotosInteractor implements UploadPhotosUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}

  async run(input: Input): Promise<Output> {
    const photosPromise = input.photos.map(this.wrapWithUploadFilePromise)

    const photosJson = await Promise.all(photosPromise)
    const raws = photosJson.map(file2ReplacedRaw)
    return {
      raws,
    }
  }

  private readonly wrapWithUploadFilePromise = (content: File) => {
    const data = obj2FormData({
      type: 'net.unsweets.beta',
      name: content.name,
      kind: 'image',
      content,
      is_public: 'true',
    })
    return this.pnutRepository.uploadFile(data)
  }
}
