import { Entity } from './entity'
import { Raw } from './raw'

export interface User {
  badge?: {
    id: string
    name: string
  }
  content?: User.UserContent
  counts?: {
    bookmarks: number
    clients: number
    followers: number
    following: number
    posts: number
    users: number
  }
  created_at: Date
  follows_you: boolean
  id: string
  locale: string
  name: string
  timezone: string
  type: User.UserType
  username: string
  you_blocked: boolean
  you_can_follow: boolean
  you_follow: boolean
  you_muted: boolean
  verified?: {
    domain: string
    link: string
  }
  raw?: Raw[]
}

export interface DefinitelyUser extends User {
  content: User.UserContent
}

export namespace User {
  export namespace UserType {
    export const human = 'human' as const
    export const feed = 'feed' as const
    export const bot = 'bot' as const
  }
  export type UserType =
    | typeof UserType.human
    | typeof UserType.feed
    | typeof UserType.bot

  export function getTitle({ username, name }: User): string {
    return name ? `${name} (@${username})` : `@${username}`
  }

  export interface UserContent extends Entity.HaveEntity {
    avatar_image: UserImage
    cover_image: UserImage
    markdown_text?: string
  }
  export interface UserImage {
    link: string
    is_default: boolean
    width: number
    height: number
  }
}
