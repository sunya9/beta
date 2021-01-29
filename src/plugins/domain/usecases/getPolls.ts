import { singleton, inject } from 'tsyringe'
import { GeneralPollParameters } from '~/plugins/domain/dto/poll'
import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Poll } from '~/entity/poll'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Pagination } from '~/plugins/domain/dto/common'

interface Input {
  params?: GeneralPollParameters & Pagination
}

interface Output {
  listInfo: ListInfo<Poll>
}

export interface GetPollsUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetPollsUseCase {
  export const token = class {}
}
@singleton()
export class GetPollsInteractor implements GetPollsUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo((pagination) =>
      this.pnutRepository.getPolls({
        ...input.params,
        ...pagination,
      })
    )
    return {
      listInfo,
    }
  }
}
