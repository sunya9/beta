import { GeneralPollParameters } from '~/plugins/domain/dto/poll'
import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Poll } from '~/models/poll'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Pagination } from '~/plugins/domain/dto/common'

interface Input {
  params?: GeneralPollParameters & Pagination
}

interface Output {
  listInfo: ListInfo<Poll>
}

export interface GetPollsUseCase extends Usecase<Input, Promise<Output>> {}

export class GetPollsInteractor implements GetPollsUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo(
      (config) =>
        this.pnutRepository.getPolls({
          ...input.params,
          ...config,
        }),
      input.params
    )
    return {
      listInfo,
    }
  }
}
