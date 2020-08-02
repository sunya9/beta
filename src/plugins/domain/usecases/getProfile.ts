import { singleton, inject } from 'tsyringe'
import { User } from '~/entity/user'
import { PnutResponse } from '~/entity/pnut-response'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { GeneralUserParameters } from '~/plugins/domain/dto/user'

interface Input {
  username: string
  postParams?: GeneralPostParameters
  userParams?: GeneralUserParameters
}

interface Output {
  user: PnutResponse<User>
}

export interface GetProfileUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetProfileUseCase {
  export const token = class {}
}

@singleton()
export class GetProfileInteractor implements GetProfileUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const user = await this.pnutRepository.getUser(input.username, {
      include_user_raw: true,
      ...input.userParams,
    })
    return {
      user,
    }
  }
}
