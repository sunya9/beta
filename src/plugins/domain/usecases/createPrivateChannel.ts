import { PnutResponse } from '~/models/pnut-response'
import {
  AbstractCreatePostInteractor,
  AbstractInput,
  AbstractCreatePostUseCase,
} from '~/plugins/domain/usecases/abstractCreatePost'
import { Raw } from '~/models/raw'
import { Message } from '~/models/message'
interface Input extends AbstractInput {
  destinations: string
}
interface Output {
  res: PnutResponse<Message>
}

export interface CreatePrivateChannelUseCase
  extends AbstractCreatePostUseCase<Input, Promise<Output>> {}

export class CreatePrivateChannelInteractor
  extends AbstractCreatePostInteractor<Input, Output>
  implements CreatePrivateChannelUseCase {
  async post(input: Input & { raw: Raw<any>[] }): Promise<Output> {
    const { destinations, isNsfw, raw, text } = input
    const res = await this.pnutRepository.createPrivateChannel({
      destinations: destinations.split(/[,\s]+/g).map((name) => {
        return name.startsWith('@') ? name : `@${name}`
      }),
      is_nsfw: isNsfw,
      raw,
      text,
    })
    return {
      res,
    }
  }
}
