import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { StreamType } from '~/plugins/domain/dto/streamType'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { createListInfo, ListInfo } from '~/plugins/domain/util/util'

interface Input {
  streamType: StreamType
  params?: GeneralPostParameters
  data?: PnutResponse<Post[]>
}

interface Output {
  listInfo: ListInfo<Post>
}

export interface GetPostsUseCase extends Usecase<Input, Promise<Output>> {}

export class GetPostsInteractor implements GetPostsUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}

  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo(
      (paging) =>
        this.getPosts({
          ...input,
          params: {
            ...input.params,
            ...paging,
          },
        }),
      input.params
    )
    return {
      listInfo,
    }
  }

  private getPosts(input: Input) {
    const { streamType } = input
    const params: Input['params'] = {
      include_deleted: false,
      ...input.params,
    }
    switch (streamType.type) {
      case 'home':
        return this.getHome(streamType.unified, params)
      case 'mentions':
        return this.pnutRepository.getMentions(params)
      case 'bookmark':
        return this.pnutRepository.getBookmarks(streamType.userId, params)
      case 'global':
        return this.pnutRepository.getGlobal(params)
      case 'hashtag':
        return this.pnutRepository.getTaggedPosts(streamType.tag, params)
      case 'user':
        return this.pnutRepository.getUserPosts(streamType.userId, params)
      case 'explore':
        return this.pnutRepository.getExplore(streamType.slug, params)
    }
  }

  private getHome(unified: boolean, params?: GeneralPostParameters) {
    const method: keyof PnutRepository = unified
      ? 'getUnifiedStream'
      : 'getHomeStream'
    return this.pnutRepository[method](params)
  }
}
