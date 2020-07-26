import { inject, injectable } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Output {
  hasUnread: boolean
}

export interface GetUnreadCountUseCase
  extends UseCase<undefined, Promise<Output>> {}

export namespace GetUnreadCountUseCase {
  export const token = class {}
}

@injectable()
export class GetUnreadCountInteractor implements GetUnreadCountUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(): Promise<Output> {
    const res = await this.pnutRepository.getUnread({
      channel_types: ['io.pnut.core.pm', 'io.pnut.core.chat'],
    })
    const hasUnread =
      res.data['io.pnut.core.pm'] + (res.data['io.pnut.core.chat'] || 0) > 0
    return {
      hasUnread,
    }
  }
}
