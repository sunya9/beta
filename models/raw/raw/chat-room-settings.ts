import { Raw } from '~/models/raw'

export type ChatRoomSettings = Raw<ChatRoomSettings.Value>

export namespace ChatRoomSettings {
  export const type = 'io.pnut.core.chat-settings'
  export interface Value {
    name: string
    description?: string
    categories?: Category[]
  }
  enum Category {
    fun,
    lifestyle,
    profession,
    language,
    community,
    tech,
    event,
    general
  }
}
