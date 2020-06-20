import { UserId } from '~/plugins/domain/dto/common'
import { User } from '~/models/user'
import { GeneralUserParameters } from '~/plugins/domain/dto/user'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { createListInfo, ListInfo } from '~/plugins/domain/util/util'

interface Input {
  username: UserId
  type: 'following' | 'followers'
  params?: GeneralUserParameters
}

interface Output {
  listInfo: ListInfo<User>
}

export interface GetUsersUseCase extends Usecase<Input, Promise<Output>> {}

export class GetUsersIntereactor implements GetUsersUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}

  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo((params) => {
      const method: keyof PnutRepository =
        input.type === 'following' ? 'getFollowing' : 'getFollowing'
      return this.pnutRepository[method](input.username, {
        ...input.params,
        ...params,
      })
    }, input.params)
    return {
      listInfo,
    }
  }
}
