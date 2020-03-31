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
  raw?: Raw<any>[]
}

export interface DefinitelyUser extends User {
  content: User.UserContent
}

export namespace User {
  export enum UserType {
    human,
    feed,
    bot
  }
  export interface UserContent extends Entity.HaveEntity {
    avatar_image: UserImage
    cover_image: UserImage
    markdown_text?: string
  }
  export interface UserImage {
    link: string
    is_defualt: boolean
    width: number
    height: number
  }
}
