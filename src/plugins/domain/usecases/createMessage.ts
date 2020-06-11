import { PnutResponse } from '~/models/pnut-response'
import {
  AbstractCreatePostUseCase,
  AbstractCreatePostInteractor,
  AbstractInput,
} from '~/plugins/domain/usecases/abstractCreatePost'
import { Message } from '~/models/message'

interface Input extends AbstractInput {
  channelId: string
}
interface Output {
  res: PnutResponse<Message>
}

export interface CreateMessageUseCase
  extends AbstractCreatePostUseCase<Input, Promise<Output>> {}

export class CreateMessageInteractor
  extends AbstractCreatePostInteractor<Input, Output>
  implements CreateMessageUseCase {
  async post({
    text,
    raw,
    isNsfw: is_nsfw,
    replyTo,
    channelId,
  }: Parameters<
    AbstractCreatePostInteractor<Input, Output>['post']
  >[0]): Promise<Output> {
    const res = await this.pnutRepository.createMessage(
      channelId,
      {
        text,
        raw,
        is_nsfw,
        reply_to: replyTo,
      },
      {
        include_raw: true,
      }
    )
    return {
      res,
    }
  }
}
