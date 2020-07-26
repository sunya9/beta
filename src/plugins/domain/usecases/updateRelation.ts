import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutResponse } from '~/models/pnut-response'
import { User } from '~/models/user'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Input {
  type: 'block' | 'mute' | 'follow' | 'unblock' | 'unmute' | 'unfollow'
  userId: string
}

interface Output {
  res: PnutResponse<User>
}

export interface UpdateRelationUseCase
  extends UseCase<Input, Promise<Output>> {}

export namespace UpdateRelationUseCase {
  export const token = class {}
}

@singleton()
export class UpdateRelationInteractor implements UpdateRelationUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const res = await this.get(input.type, input.userId)
    return {
      res,
    }
  }

  private get(type: Input['type'], userId: string) {
    switch (type) {
      case 'block':
        return this.pnutRepository.block(userId)
      case 'unblock':
        return this.pnutRepository.unblock(userId)
      case 'mute':
        return this.pnutRepository.mute(userId)
      case 'unmute':
        return this.pnutRepository.unmute(userId)
      case 'follow':
        return this.pnutRepository.follow(userId)
      case 'unfollow':
        return this.pnutRepository.unfollow(userId)
    }
  }
}
