import { PnutResponse } from '~/models/pnut-response'
import {
  AbstractCreatePostUseCase,
  AbstractCreatePostInteractor,
  AbstractInput,
} from '~/plugins/domain/usecases/abstractCreatePost'
import { Message } from '~/models/message'
import { Crosspost } from '~/models/raw/raw/crosspost'
import { ChannelInvite } from '~/models/raw/raw/channel-invite'
import { CreatePostUseCase } from '~/plugins/domain/usecases/createPost'
import { CreatePollUseCase } from '~/plugins/domain/usecases/createPoll'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { CreateFileUseCase } from '~/plugins/domain/usecases/createFile'
import { Raw } from '~/models/raw'

interface Input extends AbstractInput {
  text: string
  isNsfw: boolean
  replyTo?: string
  channelId: string
  raw?: Raw<any>[]
  broadcast?: boolean
}
interface Output {
  res: PnutResponse<Message>
}

export interface CreateMessageUseCase
  extends AbstractCreatePostUseCase<Input, Promise<Output>> {}

export class CreateMessageInteractor
  extends AbstractCreatePostInteractor<Input, Output>
  implements CreateMessageUseCase {
  constructor(
    pnutRepository: PnutRepository,
    createFileUseCase: CreateFileUseCase,
    createPollUseCase: CreatePollUseCase,
    private readonly createPostUseCase: CreatePostUseCase
  ) {
    super(pnutRepository, createFileUseCase, createPollUseCase)
  }

  async post({
    channelId,
    broadcast,
    ...rest
  }: Parameters<AbstractCreatePostInteractor<Input, Output>['post']>[0] &
    Input): Promise<Output> {
    const { text, raw, isNsfw: is_nsfw, replyTo } = rest
    if (broadcast) await this.broadcast(channelId, rest)
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

  async broadcast(channelId: string, input: AbstractInput) {
    const crosspost: Crosspost = {
      type: 'io.pnut.core.crosspost',
      value: {
        // TODO: use rel="canonical" value in the future
        canonical_url: location.href,
      },
    }
    const invite: ChannelInvite = {
      type: 'io.pnut.core.channel.invite',
      value: {
        channel_id: channelId,
      },
    }
    const raw: Raw<any>[] = [crosspost, invite]
    await this.createPostUseCase.run({
      ...input,
      raw,
      passRawHandling: true,
    })
  }
}
