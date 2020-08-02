import { singleton, inject } from 'tsyringe'
import { UserId } from '~/plugins/domain/dto/common'
import { User } from '~/entity/user'
import { GeneralUserParameters } from '~/plugins/domain/dto/user'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { createListInfo, ListInfo } from '~/plugins/domain/util/util'

type UserType =
  | {
      type: 'following'
      userId: UserId
    }
  | {
      type: 'followers'
      userId: UserId
    }
  | { type: 'blocked' }
  | { type: 'muted' }

interface Input {
  type: UserType
  params?: GeneralUserParameters
}

interface Output {
  listInfo: ListInfo<User>
}

export interface GetUsersUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetUsersUseCase {
  export const token = class {}
}

@singleton()
export class GetUsersInteractor implements GetUsersUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const listInfo = await this.createListInfo(input)
    return {
      listInfo,
    }
  }

  private createListInfo(input: Input) {
    const { type } = input
    return createListInfo((newParams) => {
      const params = {
        ...input.params,
        ...newParams,
      }
      switch (type.type) {
        case 'followers':
          return this.pnutRepository.getFollowers(type.userId, params)
        case 'following':
          return this.pnutRepository.getFollowing(type.userId, params)
        case 'blocked':
          return this.pnutRepository.getBlockedUsers(params)
        case 'muted':
          return this.pnutRepository.getMutedUsers(params)
      }
    }, input.params)
  }
}
