import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/entity/pnut-response'
import { User } from '~/entity/user'

interface Input {
  name: string
  text: string
  timezone: string
  locale: string
}

interface Output {
  res: PnutResponse<User>
}

export interface UpdateProfileUseCase extends UseCase<Input, Promise<Output>> {}

export namespace UpdateProfileUseCase {
  export const token = class {}
}

@singleton()
export class UpdateProfileInteractor implements UpdateProfileUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input) {
    const { locale, timezone, name, text } = input
    const res = await this.pnutRepository.updateUser({
      locale,
      content: {
        text,
      },
      name,
      timezone,
    })
    return {
      res,
    }
  }
}
