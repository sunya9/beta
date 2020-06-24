import { singleton, inject } from 'tsyringe'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Channel } from '~/models/channel'
import { GeneralChannelParameters } from '~/plugins/domain/dto/channel'
import { Pagination } from '~/plugins/domain/dto/common'

interface Input {
  isPrivate: boolean
  all: boolean
  params?: GeneralChannelParameters & Pagination
}

interface Output {
  listInfo: ListInfo<Channel>
}

export interface GetChannelsUseCase extends Usecase<Input, Promise<Output>> {}

export namespace GetChannelsUseCase {
  export const token = class {}
}

@singleton()
export class GetChannelsInteractor implements GetChannelsUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo(
      (config) =>
        this.getChannels({
          ...input,
          params: {
            ...input.params,
            ...config,
          },
        }),
      input.params
    )
    return {
      listInfo,
    }
  }

  private getChannels(input: Input) {
    if (input.isPrivate)
      return this.pnutRepository.getSubscribedChannels({
        ...input.params,
        channel_types: ['io.pnut.core.pm'],
      })
    else if (!input.all)
      return this.pnutRepository.getSubscribedChannels({
        ...input.params,
        channel_types: ['io.pnut.core.chat'],
      })
    else
      return this.pnutRepository.searchChannels({
        ...input.params,
        include_inactive: true,
        channel_types: ['io.pnut.core.chat'],
      })
  }
}
