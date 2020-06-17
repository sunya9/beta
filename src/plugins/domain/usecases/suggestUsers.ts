import { Usecase } from '~/plugins/domain/usecases/usecase'
import { User } from '~/models/user'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Input {
  name: string
}

interface Output {
  users: User[]
}

export interface SuggestUsersUseCase extends Usecase<Input, Promise<Output>> {}

export class SuggestUsersInteracator implements SuggestUsersUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    const res = await this.pnutRepository.searchUsers({
      count: 5,
      q: input.name,
    })
    return {
      users: res.data,
    }
  }
}
