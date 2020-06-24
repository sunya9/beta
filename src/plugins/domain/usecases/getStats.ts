import { singleton, inject } from 'tsyringe'
import { PnutResponse } from '~/models/pnut-response'
import { Stats } from '~/models/stats'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Output {
  stats: PnutResponse<Stats>
}

export interface GetStatsUseCase extends Usecase<void, Promise<Output>> {}

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
