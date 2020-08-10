import { BaseRaw, Raw } from '~/entity/raw'
import { Channel } from '~/entity/channel'

export namespace ChatRoomSettings {
  export const type = 'io.pnut.core.chat-settings' as const
  export interface Value {
    name: string
    description?: string
    categories?: Category[]
  }
  type Category =
    | 'fun'
    | 'lifestyle'
    | 'profession'
    | 'language'
    | 'community'
    | 'tech'
    | 'event'
    | 'general'

  export function isChatRoomSettings(raw?: Raw): raw is ChatRoomSettings {
    return raw?.type === ChatRoomSettings.type
  }

  export function findChatValueRaw(
    channel: Channel
  ): ChatRoomSettings.Value | void {
    if (!channel.raw) return
    const chatRaw = channel.raw.find(
      (r): r is ChatRoomSettings => r.type === type
    )
    if (!chatRaw) return
    return chatRaw.value
  }
}

export interface ChatRoomSettings extends BaseRaw {
  type: typeof ChatRoomSettings.type
  value: ChatRoomSettings.Value
}
