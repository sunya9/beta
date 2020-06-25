import { singleton, inject } from 'tsyringe'
import { ListInfo } from '~/plugins/domain/util/util'
import { Post } from '~/models/post'
import { User } from '~/models/user'
import { PnutResponse } from '~/models/pnut-response'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GetPostsUseCase } from '~/plugins/domain/usecases/getPosts'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { GeneralUserParameters } from '~/plugins/domain/dto/user'

interface Input {
  username: string
  postParams?: GeneralPostParameters
  userParams?: GeneralUserParameters
}

interface Output {
  user: PnutResponse<User>
  listInfo: ListInfo<Post>
}

export interface GetProfileWithPostsUseCase
  extends Usecase<Input, Promise<Output>> {}

export namespace GetProfileWithPostsUseCase {
  export const token = class {}
}

@singleton()
export class GetProfileWithPostsInteractor
  implements GetProfileWithPostsUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository,
    @inject(GetPostsUseCase.token)
    private readonly getPostsUseCase: GetPostsUseCase
  ) {}

  async run(input: Input): Promise<Output> {
    const p1 = this.getPostsUseCase.run({
      type: 'user',
      userId: input.username,
      params: input.postParams,
    })
    const p2 = this.pnutRepository.getUser(input.username, {
      include_user_raw: true,
      ...input.userParams,
    })
    const [{ listInfo }, user] = await Promise.all([p1, p2])
    return {
      user,
      listInfo,
    }
  }
}
