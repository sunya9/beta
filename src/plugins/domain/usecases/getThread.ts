import { singleton, inject } from 'tsyringe'
import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Post } from '~/models/post'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { Pagination } from '~/plugins/domain/dto/common'
import { getHtmlMeta } from '~/plugins/domain/util/postUtil'

interface Input {
  postId: string
  params?: GeneralPostParameters & Pagination
}

interface Output {
  title?: string
  listInfo: ListInfo<Post>
  meta?: any[] // TODO?
}

export interface GetThreadUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetThreadUseCase {
  export const token = class {}
}

@singleton()
export class GetThreadInteractor implements GetThreadUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo(
      (config) =>
        this.pnutRepository.getThread(input.postId, {
          include_post_raw: true,
          ...input.params,
          ...config,
        }),
      input.params
    )
    const data = listInfo.data
    const id = input.postId
    const post = data.find((post) => post.id === id)
    const metas = getHtmlMeta(post)
    return {
      listInfo,
      title: metas?.title,
      meta: metas?.meta,
    }
  }
}
