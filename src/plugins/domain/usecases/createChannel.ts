import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { PnutResponse } from '~/models/pnut-response'
import { Channel } from '~/models/channel'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'

interface Input {
  name: string
  description: string
  categories: ChatRoomSettings.Value['categories']
}
interface Output {
  res: PnutResponse<Channel>
}

export interface CreateChannelUseCase extends Usecase<Input, Promise<Output>> {}

export class CreateChannelInteractor implements CreateChannelUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}

  async run({ name, description, categories }: Input): Promise<Output> {
    const chatRoomSettings: ChatRoomSettings = {
      type: 'io.pnut.core.chat-settings',
      value: {
        name,
        description,
        categories: categories?.length ? categories : undefined,
      },
    }
    const res = await this.pnutRepository.createChannel({
      type: 'io.pnut.core.chat',
      acl: {
        read: {
          public: false,
        },
      },
      raw: [chatRoomSettings],
    })
    return {
      res,
    }
  }
}
