import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PostPollRequest } from '~/plugins/domain/dto/poll'
import { Poll } from '~/models/poll'

interface Input {
  poll: PostPollRequest
  fallbackText?: string
}

interface Output {
  poll: Poll
}
export interface PostPollUseCase extends Usecase<Input, Promise<Output>> {}

export class PostPollInteractor implements PostPollUseCase {
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
