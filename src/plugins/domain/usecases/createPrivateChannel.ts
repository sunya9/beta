import { singleton } from 'tsyringe'
import { PnutResponse } from '~/models/pnut-response'
import {
  AbstractCreatePostInteractor,
  AbstractInput,
  AbstractCreatePostUseCase,
} from '~/plugins/domain/usecases/abstractCreatePost'
import { Raw } from '~/models/raw'
import { Message } from '~/models/message'
import { User } from '~/models/user'
interface Input extends AbstractInput {
  users: User[]
}
interface Output {
  res: PnutResponse<Message>
}

export interface CreatePrivateChannelUseCase
  extends AbstractCreatePostUseCase<Input, Promise<Output>> {}

export namespace CreatePrivateChannelUseCase {
  export const token = class {}
}

@singleton()
export class CreatePrivateChannelInteractor
  extends AbstractCreatePostInteractor<Input, Output>
  implements CreatePrivateChannelUseCase {
  async post(input: Input & { raw: Raw[] }): Promise<Output> {
    const { users, isNsfw, raw, text } = input
    const res = await this.pnutRepository.createPrivateChannel({
      destinations: users.map((user) => user.id),
      is_nsfw: isNsfw,
      raw,
      text,
    })
    return {
      res,
    }
  }
}
