import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { StreamType } from '~/plugins/domain/dto/streamType'
import {
  GetListBaseInput,
  GetListBaseOutput,
  GetListUseCase,
  GetListInteractor,
} from '~/plugins/domain/usecases/getList'

interface Input extends GetListBaseInput {
  streamType: StreamType
  params?: GeneralPostParameters
  data?: PnutResponse<Post[]>
}

interface Output extends GetListBaseOutput<Post> {}

export interface GetPostsUseCase
  extends GetListUseCase<Post, Input, Promise<Output>> {}

export class GetPostsInteractor
  extends GetListInteractor<Post, Input, Promise<Output>>
  implements GetPostsUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {
    super()
  }

  getList(input: Input): Promise<PnutResponse<Post[]>> {
    return this.getPosts(input)
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
