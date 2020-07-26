// import WebSocket from 'ws'
import { inject, singleton } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Connection } from '~/models/connection'
import { ConfigRepository } from '~/plugins/domain/repository/configStorage'
import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import { Channel } from '~/models/channel'
import { Message } from '~/models/message'

interface Input {
  accessToken: string
  handlers: {
    newHomeStreamHandler(post?: PnutResponse<Post>): void
    newMentionHandler(post?: PnutResponse<Post>): void
    newAnyMesssageHandler(channel?: PnutResponse<Channel>): void
    newChannelMesssageHandler(channel: PnutResponse<Message>): void
  }
  connectionError: (error: Error) => void
}

type Output = void
export interface CreateConnectionUseCase extends UseCase<Input, Output> {}

export namespace CreateConnectionUseCase {
  export const token = class {}
}

const thirtySecMs = 30 * 1000

type SubscriptionType =
  | SubscriptionType.home
  | SubscriptionType.mention
  | SubscriptionType.channels
  | SubscriptionType.messages

export namespace SubscriptionType {
  export const home = 'home' as const
  export type home = typeof home
  export const mention = 'mention' as const
  export type mention = typeof mention
  export const channels = 'channels' as const
  export type channels = typeof channels
  export const messages = 'messages' as const
  export type messages = typeof messages
}

function isConnection(obj: any): obj is Connection {
  return !!obj?.['meta']?.['connection_id']
}

function isPnutRes(obj: any): obj is PnutResponse<any> {
  return !!obj?.['meta']?.['subscription_ids']
}

type SubscriptionIdTypeMap = { [key: string]: SubscriptionType }

@singleton()
export class CreateConnectionInteractor implements CreateConnectionUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository,
    @inject(ConfigRepository.token)
    private readonly configRepository: ConfigRepository
  ) {}

  run(input: Input): Output {
    this.connect(input)
    return undefined
  }

  async connect(input: Input) {
    let waitTime = 500
    while (true) {
      const isError = await this.getConnectLoop(input)
      if (isError) {
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        // exponential back off
        waitTime = waitTime * 2
      } else {
        waitTime = 500
      }
    }
  }

  getConnectLoop(input: Input) {
    return new Promise<Error | undefined>((resolve) => {
      this.setupWebSocket(input, resolve)
    })
  }

  setupWebSocket(input: Input, resolve: (error?: Error) => void) {
    const ws = new WebSocket(
      `wss://stream.pnut.io/v0/user?access_token=${input.accessToken}`
    )
    const timer = setInterval(() => {
      if (ws.readyState !== WebSocket.OPEN) return
      ws.send('💓')
    }, thirtySecMs)

    const cleanup = (ev: WebSocketEventMap['close']) => {
      clearInterval(timer)
      ws.removeEventListener('close', cleanup)
      const error = ev.code === 1000 ? undefined : new Error() // TODO
      resolve(error)
    }
    ws.addEventListener('message', (data) => {
      const obj = JSON.parse(data.data)
      this.messageHandler(input, obj)
    })
    ws.addEventListener('close', cleanup)
  }

  subscriptionId2SubscriptionTypeMap: SubscriptionIdTypeMap | null = null

  async messageHandler(input: Input, obj: object) {
    if (isConnection(obj)) {
      const { subscriptionMap, unreads } = await this.getDefaultSubscriptionIds(
        obj.meta.connection_id
      )
      this.subscriptionId2SubscriptionTypeMap = subscriptionMap
      if (unreads.channels) {
        input.handlers.newAnyMesssageHandler()
      }
      if (unreads.home) {
        input.handlers.newHomeStreamHandler()
      }
      if (unreads.mention) {
        input.handlers.newMentionHandler()
      }
    } else if (isPnutRes(obj)) {
      this.notifyNewItem(input, obj)
    }
  }

  notifyNewItem(input: Input, obj: PnutResponse<any>) {
    const map = this.subscriptionId2SubscriptionTypeMap
    if (!map) return
    obj.meta.subscription_ids?.forEach((subscriptionId) => {
      const type = map[subscriptionId]
      switch (type) {
        case SubscriptionType.home:
          return input.handlers.newHomeStreamHandler(obj)
        case SubscriptionType.mention:
          return input.handlers.newMentionHandler(obj)
        case SubscriptionType.messages:
          return input.handlers.newChannelMesssageHandler(obj)
        case SubscriptionType.channels:
          return input.handlers.newAnyMesssageHandler(obj)
      }
    })
  }

  async getDefaultSubscriptionIds(connection_id: string) {
    const subscribedChannelPromise = this.pnutRepository.getSubscribedChannels({
      connection_id,
      include_read: false,
    })
    const isUnified = this.configRepository.isEnabledUnifiedStream
    const method = PnutRepository.getHomeLikeStreamMethod(isUnified)
    const homeStreamPromise = this.pnutRepository[method]({
      include_directed_posts: this.configRepository.isEnabledDirectedPosts,
      connection_id,
      include_marker: true,
    })
    const mentionPromise = this.pnutRepository.getMentions({
      include_directed_posts: this.configRepository.isEnabledDirectedPosts,
      connection_id,
      include_marker: true,
    })
    // workaround
    const channelUNreadPromise = this.pnutRepository.getUnread({
      channel_types: ['io.pnut.core.chat', 'io.pnut.core.pm'],
    })

    const [
      {
        meta: { subscription_id: channelSubscriptionId /* unread_counts */ },
      },
      {
        meta: { subscription_id: homeSubscriptionId, marker: homeMarker },
        data: homeData,
      },
      {
        meta: { subscription_id: mentionSubscriptionId, marker: mentionMarker },
        data: mentionData,
      },
      { data: unreadData },
    ] = await Promise.all([
      subscribedChannelPromise,
      homeStreamPromise,
      mentionPromise,
      channelUNreadPromise,
    ])
    return {
      subscriptionMap: {
        [homeSubscriptionId!]: SubscriptionType.home,
        [mentionSubscriptionId!]: SubscriptionType.mention,
        [channelSubscriptionId!]: SubscriptionType.channels,
      },
      unreads: {
        [SubscriptionType.channels]:
          (unreadData?.['io.pnut.core.chat'] || 0) +
            (unreadData?.['io.pnut.core.pm'] || 0) >
          0,
        [SubscriptionType.home]: homeData[0]?.id !== homeMarker?.last_read_id,
        [SubscriptionType.mention]:
          mentionData[0]?.id !== mentionMarker?.last_read_id,
      },
    } as const
  }
}
