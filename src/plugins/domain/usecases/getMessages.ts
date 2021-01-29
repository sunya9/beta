import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { Message } from '~/entity/message'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralMessageParameters } from '~/plugins/domain/dto/message'
import { Pagination } from '~/plugins/domain/dto/common'
import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Channel } from '~/entity/channel'

interface Input {
  channelId: string
  params?: GeneralMessageParameters & Pagination
}

interface Output {
  listInfo: ListInfo<Message>
  channel: Channel
}

export interface GetMessagesUseCase extends UseCase<Input, Promise<Output>> {}

export namespace GetMessagesUseCase {
  export const token = class {}
}

@singleton()
export class GetMessagesInteractor implements GetMessagesUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const [listInfo, { data: channel }] = await Promise.all([
      this.createListInfo(input),
      this.getChannel(input),
    ])
    return {
      listInfo,
      channel,
    }
  }

  private createListInfo(input: Input) {
    return createListInfo((pagination) =>
      this.pnutRepository.getMessages(input.channelId, {
        include_deleted: true,
        ...input.params,
        ...pagination,
      })
    )
  }

  private getChannel(input: Input) {
    return this.pnutRepository.getChannel(input.channelId, {
      include_limited_users: true,
      include_channel_raw: true,
    })
  }
}
