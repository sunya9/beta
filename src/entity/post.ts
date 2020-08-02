import { DefinitelyUser, User } from './user'
import { Entity } from './entity'
import { Raw, HasRaw } from './raw'
import { Pageable } from './pageable'

export interface Post extends HasRaw, Pageable {
  created_at: Date
  id: string
  is_deleted: boolean
  is_nsfw: boolean
  is_revised: boolean
  revision?: string
  source: {
    name: string
    link: string
    id: string
  }
  user?: User
  thread_id: string
  reply_to?: string
  repost_of?: Post
  counts?: {
    bookmarks: number
    replies: number
    reposts: number
    threads: number
  }
  content?: Post.PostContent
  you_bookmarked?: boolean
  you_reposted: boolean
  bookmarked_by?: User[]
  reposted_by?: User[]
}

export interface DefinitelyPost extends Post {
  content: Post.PostContent
  user: DefinitelyUser
}

export namespace Post {
  export interface PostContent extends Entity.HaveEntity {
    links_not_parsed: boolean
  }
  export interface PostBody {
    text: string
    raw: Raw[]
    is_nsfw?: boolean
    reply_to?: string
  }
}
