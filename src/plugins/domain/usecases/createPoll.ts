import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'
import { Poll } from '~/models/poll'

interface Input {
  poll: CreatePollRequest
  fallbackText?: string
}

interface Output {
  poll: Poll
}
export interface CreatePollUseCase extends Usecase<Input, Promise<Output>> {}

export class CreatePollInteractor implements CreatePollUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
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
