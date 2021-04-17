import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/entity/pnut-response'
import { Channel } from '~/entity/channel'

interface Input {
  userIds: string[]
}

interface Output {
  res: PnutResponse<Channel>
}

export interface ExistingPmUseCase extends UseCase<Input, Promise<Output>> {}

export namespace ExistingPmUseCase {
  export const token = class {}
}

@singleton()
export class ExistingPmInteractor implements ExistingPmUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const res = await this.pnutRepository.existingPm(input.userIds)
    return {
      res,
    }
  }
}
