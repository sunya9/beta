import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Post } from '~/models/post'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { getHtmlMeta } from '~/plugins/domain/util/postUtil'

interface Input {
  postId: string
  params?: GeneralPostParameters
}

interface Output {
  title?: string
  listInfo: ListInfo<Post>
  meta?: any[] // TODO?
}

export interface GetRevisionUseCase extends Usecase<Input, Promise<Output>> {}

export class GetRevisionInteractor implements GetRevisionUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo(
      (config) =>
        this.pnutRepository.getRevision(input.postId, {
          ...input.params,
          ...config,
        }),
      input.params
    )
    const data = listInfo.data
    const [post] = data
    const metas = getHtmlMeta(post)
    return {
      listInfo,
      title: metas?.title,
      meta: metas?.meta,
    }
  }
}
