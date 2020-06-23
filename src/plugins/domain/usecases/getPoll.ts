import { GeneralPollParameters } from '~/plugins/domain/dto/poll'
import { Poll } from '~/models/poll'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/models/pnut-response'

interface Input {
  pollId: string
  pollToken: string
  params?: GeneralPollParameters
}

interface Output {
  res: PnutResponse<Poll>
}

export interface GetPollUseCase extends Usecase<Input, Promise<Output>> {}

export class GetPollInteractor implements GetPollUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    const res = await this.pnutRepository.getPoll(input.pollId, {
      poll_token: input.pollToken,
      ...input.params,
    })
    return {
      res,
    }
  }
}
