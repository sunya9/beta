import { singleton, inject } from 'tsyringe'
import { PnutResponse } from '~/entity/pnut-response'
import { Post } from '~/entity/post'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { StreamType } from '~/plugins/domain/dto/streamType'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { createListInfo, ListInfo } from '~/plugins/domain/util/util'
import { StreamMarkerParams } from '~/plugins/domain/dto/common'
import { ConfigRepository } from '~/plugins/domain/repository/configStorage'

type Input = StreamType & {
  params?: GeneralPostParameters & StreamMarkerParams
  data?: PnutResponse<Post[]>
}

interface Output {
  listInfo: ListInfo<Post>
}

export interface GetPostsUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetPostsUseCase {
  export const token = class {}
}

@singleton()
export class GetPostsInteractor implements GetPostsUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository,
    @inject(ConfigRepository.token)
    private readonly configRepository: ConfigRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo(
      (paging) =>
        this.getPosts({
          ...input,
          params: {
            include_post_raw: true,
            include_directed_posts: this.configRepository
              .isEnabledDirectedPosts,
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
    const params: Input['params'] = {
      include_deleted: false,
      ...input.params,
    }
    switch (input.type) {
      case 'home':
        return this.getHome(input.unified, params)
      case 'mentions':
        return this.pnutRepository.getMentions(params)
      case 'bookmark':
        return this.pnutRepository.getBookmarks(input.userId, params)
      case 'global':
        return this.pnutRepository.getGlobal(params)
      case 'hashtag':
        return this.pnutRepository.getTaggedPosts(input.tag, params)
      case 'user':
        return this.pnutRepository.getUserPosts(input.userId, params)
      case 'explore':
        return this.pnutRepository.getExplore(input.slug, params)
    }
  }

  private getHome(unified: boolean, params?: GeneralPostParameters) {
    const method = PnutRepository.getHomeLikeStreamMethod(unified)
    return this.pnutRepository[method](params)
  }
}
