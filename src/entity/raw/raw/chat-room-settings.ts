import { BaseRaw, Raw } from '~/entity/raw'

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
}

export interface ChatRoomSettings extends BaseRaw {
  type: typeof ChatRoomSettings.type
  value: ChatRoomSettings.Value
}
