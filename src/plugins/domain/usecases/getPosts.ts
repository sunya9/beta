import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { StreamType } from '~/plugins/domain/dto/streamType'
import { composeList, getInserPosition } from '~/plugins/domain/util/util'

interface Input {
  streamType: StreamType
  params?: GeneralPostParameters
  data?: PnutResponse<Post[]>
}

interface Output {
  res: PnutResponse<Post[]>
}

export interface GetPostsUseCase extends Usecase<Input, Promise<Output>> {}

export class GetPostsInteractor implements GetPostsUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    const res = await this.getPosts(input)
    const data = composeList({
      newData: res.data,
      data: input.data?.data,
      insertPosition: getInserPosition(input.params),
    })
    return {
      res: {
        meta: res.meta,
        data,
      },
    }
  }

  private getPosts(input: Input) {
    const { streamType, params } = input
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
    if (unified) {
      return this.pnutRepository.getUnifiedStream(params)
    } else {
      return this.pnutRepository.getHomeStream(params)
    }
  }
}
