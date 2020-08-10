import { Entity } from './entity'
import { Raw } from './raw'

export interface User {
  badge?: User.Badge
  content?: User.UserContent
  counts?: User.UserCounts
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
  verified?: User.Verified
  raw?: Raw[]
}

export interface DefinitelyUser extends User {
  content: User.UserContent
}

export namespace User {
  export interface Badge {
    id: string
    name: string
  }
  export interface Verified {
    domain: string
    link: string
  }
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
  export interface UserCounts {
    bookmarks: number
    clients: number
    followers: number
    following: number
    posts: number
    users: number
  }
  export interface UserImage {
    link: string
    is_default: boolean
    width: number
    height: number
  }
}

export class UserEntity implements User {
  constructor(user: User) {
    this.badge = user.badge
    this.content = user.content
    this.counts = user.counts
    this.created_at = user.created_at
    this.follows_you = user.follows_you
    this.id = user.id
    this.locale = user.locale
    this.name = user.name
    this.timezone = user.timezone
    this.type = user.type
    this.username = user.username
    this.you_blocked = user.you_blocked
    this.you_can_follow = user.you_can_follow
    this.you_follow = user.you_follow
    this.you_muted = user.you_muted
    this.verified = user.verified
    this.raw = user.raw
  }

  readonly badge?: User.Badge
  readonly content?: User.UserContent
  readonly counts?: User.UserCounts
  readonly created_at: Date
  readonly follows_you: boolean
  readonly id: string
  readonly locale: string
  readonly name: string
  readonly timezone: string
  readonly type: User.UserType
  readonly username: string
  readonly you_blocked: boolean
  readonly you_can_follow: boolean
  readonly you_follow: boolean
  readonly you_muted: boolean
  readonly verified?: User.Verified
  readonly raw?: Raw[]

  get isMe() {
    return this.you_follow && this.follows_you && !this.you_can_follow
  }
}
