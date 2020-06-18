import { UserId } from '~/plugins/domain/dto/common'
import {
  GetListBaseOutput,
  GetListBaseInput,
  GetListUseCase,
  GetListInteractor,
} from '~/plugins/domain/usecases/getList'
import { User } from '~/models/user'
import { GeneralUserParameters } from '~/plugins/domain/dto/user'
import { PnutResponse } from '~/models/pnut-response'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Input extends GetListBaseInput {
  username: UserId
  type: 'following' | 'followers'
  params?: GeneralUserParameters
}

interface Output extends GetListBaseOutput<User> {}

export interface GetUsersUseCase
  extends GetListUseCase<User, Input, Promise<Output>> {}

export class GetUsersIntereactor
  extends GetListInteractor<User, Input, Promise<Output>>
  implements GetUsersUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {
    super()
  }

  getList(input: Input): Promise<PnutResponse<User[]>> {
    const method: keyof PnutRepository =
      input.type === 'following' ? 'getFollowing' : 'getFollowing'
    return this.pnutRepository[method](input.username, input.params)
  }
}
