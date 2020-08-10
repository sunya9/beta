import { User } from './user'
import { Message } from './message'
import { Raw } from './raw'

export interface Channel {
  id: string
  is_active: boolean
  type: string
  owner?: User
  recent_message_id?: string
  recent_message?: Message
  acl: Channel.Acl
  counts: {
    messages: number
    subscribers: number
  }
  you_subscribed: boolean

  you_muted: boolean
  has_unread: boolean
  raw?: Raw[]
}

export namespace Channel {
  export interface Acl {
    full: {
      immutable: boolean
      you: boolean
      user_ids: Array<string | SimpleUser>
    }
    write: {
      any_user: boolean
      immutable: boolean
      you: boolean
      user_ids: Array<string | SimpleUser>
    }
    read: {
      any_user: boolean
      immutable: boolean
      public: boolean
      you: boolean
      user_ids: Array<string | SimpleUser>
    }
  }
  export interface SimpleUser {
    username: string
    name: string
    id: string
    avatar_image: string
  }

  export type Permission = keyof Acl

  export interface UserWithAcl
    extends Pick<Channel.SimpleUser, 'username' | 'avatar_image'> {
    acl: Channel.Permission
  }

  export const channelCategories = [
    'general',
    'fun',
    'lifestyle',
    'profession',
    'language',
    'community',
    'tech',
    'event',
  ] as const

  export type ChannelCategory = typeof channelCategories[number]
}
