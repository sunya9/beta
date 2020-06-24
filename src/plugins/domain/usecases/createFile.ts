import { singleton, inject } from 'tsyringe'
import { Raw } from '~/models/raw'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/models/pnut-response'
import { File as PnutFile } from '~/models/file'
import { Usecase } from '~/plugins/domain/usecases/usecase'

interface Input {
  files: File[]
}
interface Output {
  fileRawList: Raw<PnutFile.Replacement>[]
}

function obj2FormData(obj: { [key: string]: string | Blob }) {
  return Object.keys(obj).reduce((fd, key) => {
    fd.append(key, obj[key])
    return fd
  }, new FormData())
}

function file2ReplacedRaw(
  fileRes: PnutResponse<PnutFile>
): Raw<PnutFile.Replacement> {
  const image = fileRes.data
  const value = {
    '+io.pnut.core.file': {
      file_id: image.id,
      file_token: image.file_token,
      format: 'oembed',
    },
  } as const
  return {
    type: 'io.pnut.core.oembed',
    value,
  }
}

export interface CreateFileUseCase extends Usecase<Input, Promise<Output>> {}

export namespace CreateFileUseCase {
  export const token = class {}
}

@singleton()
export class CreateFileInteractor implements CreateFileUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const photosPromise = input.files.map(this.wrapWithUploadFilePromise)

    const photosJson = await Promise.all(photosPromise)
    const raws = photosJson.map(file2ReplacedRaw)
    return {
      fileRawList: raws,
    }
  }

  private readonly wrapWithUploadFilePromise = (content: File) => {
    const data = obj2FormData({
      type: 'net.unsweets.beta',
      name: content.name,
      content,
      is_public: 'true',
    })
    return this.pnutRepository.uploadFile(data)
  }
}
