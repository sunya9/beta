import { startCase } from 'lodash'
import { singleton, inject } from 'tsyringe'
import { GeneralFileParameters } from '~/plugins/domain/dto/file'
import { Pagination } from '~/plugins/domain/dto/common'
import { File } from '~/models/file'
import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

const map: { [key in File.Kind]: string } = {
  audio: ['mpeg', 'mp4', 'wave', 'flac'].map((ext) => `audio/${ext}`).join(','),
  video: ['mpeg', 'webm'].map((ext) => `video/${ext}`).join(','),
  image: ['png', 'jpeg', 'gif'].map((ext) => `image/${ext}`).join(','),
  other: '',
} as const

function isKind(kindStr?: string): kindStr is File.Kind {
  return !!kindStr && Object.keys(map).includes(kindStr)
}

export interface ModifiedFile extends File {
  select: boolean
}

function addSelectField(file: File) {
  const modifiedFile = {
    ...file,
    select: false,
  }
  return modifiedFile
}

interface Input {
  kind?: string | (string | null)[]
  params?: GeneralFileParameters & Pagination
}

interface Output {
  listInfo: ListInfo<ModifiedFile>
  title: string
}

function getTitle(kindStr?: string) {
  const prefix = isKind(kindStr) ? startCase(kindStr) : 'Your'
  return `${prefix} files`
}

export interface GetFilesUseCase extends Usecase<Input, Promise<Output>> {}

export namespace GetFilesUseCase {
  export const token = class {}
}

@singleton()
export class GetFilesInteractor implements GetFilesUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const kindStr = input.kind?.toString()
    const listInfo = await createListInfo(async (config) => {
      const { data, meta } = await this.pnutRepository.getFiles({
        ...input.params,
        ...config,
        mime_types: isKind(kindStr) ? [map[kindStr]] : undefined,
      })
      return {
        meta,
        data: data.map(addSelectField),
      }
    }, input.params)
    const title = getTitle(kindStr)
    return {
      listInfo,
      title,
    }
  }
}
