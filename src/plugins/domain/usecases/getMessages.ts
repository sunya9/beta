import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutResponse } from '~/models/pnut-response'
import { Message } from '~/models/message'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Input {
  channelId: string
  sinceId?: string
  beforeId?: string
}

interface Output {
  res: PnutResponse<Message[]>
}

export interface GetMessagesUseCase extends Usecase<Input, Promise<Output>> {}

export class GetMessagesInteractor implements GetMessagesUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    const res = await this.pnutRepository.getMessages(input.channelId, {
      since_id: input.sinceId,
      before_id: input.beforeId,
      include_deleted: true,
    })
    return {
      res,
    }
  }
}
