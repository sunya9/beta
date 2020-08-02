import { singleton, inject } from 'tsyringe'
import { PnutResponse } from '~/entity/pnut-response'
import { Stats } from '~/entity/stats'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Output {
  stats: PnutResponse<Stats>
}

export interface GetStatsUseCase extends UseCase<void, Promise<Output>> {}

export namespace GetStatsUseCase {
  export const token = class {}
}

@singleton()
export class GetStatsInteractor implements GetStatsUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(): Promise<Output> {
    const stats = await this.pnutRepository.getStats()
    return { stats }
  }
}
