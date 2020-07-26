import { singleton, inject } from 'tsyringe'
import { GeneralPollParameters } from '~/plugins/domain/dto/poll'
import { Poll } from '~/models/poll'
import { UseCase } from '~/plugins/domain/usecases/usecase'
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

export interface GetPollUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetPollUseCase {
  export const token = class {}
}

@singleton()
export class GetPollInteractor implements GetPollUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

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
