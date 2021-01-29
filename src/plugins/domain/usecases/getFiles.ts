import { startCase } from 'lodash'
import { singleton, inject } from 'tsyringe'
import { GeneralFileParameters } from '~/plugins/domain/dto/file'
import { Pagination } from '~/plugins/domain/dto/common'
import { File } from '~/entity/file'
import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { ModifiedFile } from '~/plugins/domain/entity/ModifiedFile'

const map: { [key in File.Kind]: string } = {
  audio: ['mpeg', 'mp4', 'wave', 'flac'].map((ext) => `audio/${ext}`).join(','),
  video: ['mpeg', 'webm'].map((ext) => `video/${ext}`).join(','),
  image: ['png', 'jpeg', 'gif'].map((ext) => `image/${ext}`).join(','),
  other: '',
} as const

function isKind(kindStr?: string): kindStr is File.Kind {
  return !!kindStr && Object.keys(map).includes(kindStr)
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

export interface GetFilesUseCase extends UseCase<Input, Promise<Output>> {}

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
    const listInfo = await createListInfo(async (pagination) => {
      const { data, meta } = await this.pnutRepository.getFiles({
        ...input.params,
        ...pagination,
        mime_types: isKind(kindStr) ? [map[kindStr]] : undefined,
      })
      return {
        meta,
        data: data.map(addSelectField),
      }
    })
    const title = getTitle(kindStr)
    return {
      listInfo,
      title,
    }
  }
}
