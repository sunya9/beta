import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'
import { Poll } from '~/entity/poll'

interface Input {
  poll: CreatePollRequest
  fallbackText?: string
}

interface Output {
  poll: Poll
}
export interface CreatePollUseCase extends UseCase<Input, Promise<Output>> {}

export namespace CreatePollUseCase {
  export const token = class {}
}

@singleton()
export class CreatePollInteractor implements CreatePollUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const res = await this.pnutRepository.postPoll(
      input.poll,
      input.fallbackText
    )
    return {
      poll: res.data,
    }
  }
}
