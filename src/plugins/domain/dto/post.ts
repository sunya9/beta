import {
  Pagination,
  IdsRequest,
  InteractionType,
  SearchType,
} from '~/plugins/domain/dto/common'
import { UserIdRequest } from '~/plugins/domain/dto/user'
import { User } from '~/models/user'

export type GeneralPostParameters = Pagination & {
  include_deleted?: boolean
  include_client?: boolean
  include_counts?: boolean
  include_html?: boolean
  include_post_html?: boolean
  include_bookmarked_by?: boolean
  include_reposted_by?: boolean
  include_directed_posts?: boolean
  include_mention_posts?: boolean
  include_copy_mentions?: boolean
  include_replies?: boolean
  include_muted?: boolean
  include_raw?: boolean
  include_post_raw?: boolean
}

export type PostPostRequest = {
  text: string
  reply_to?: string
  is_nsfw?: boolean
  entities?: {
    parse_links?: boolean
    parse_markdown_links?: boolean
  }
}

export type PostIdRequest = {
  post_id: string
}

export type PutPostRequest = PostIdRequest
export type DeletePostRequest = PostIdRequest
export type GetPostRequest = PostIdRequest
export type GetPostsRequest = IdsRequest
export type GetPostRevisionsRequest = PostIdRequest
type ExploreSlugType =
  | 'conversations'
  | 'missed_conversations'
  | 'newcomers'
  | 'photos'
  | 'trending'

export type GetExploreStreamRequest = {
  slug: ExploreSlugType
}

export type GetThreadRequest = PostIdRequest
export type GetBookmarksRequest = UserIdRequest
export type PutBookmarkRequest = PostIdRequest & {
  note: string
}
export type DeleteBookmarkRequest = PostIdRequest
export type PutRepostRequest = PostIdRequest
export type DeleteRepostRequest = PostIdRequest
export type PostReportPostRequest = PostIdRequest & {
  reason: 'account_type' | 'nsfw' | 'soliciting' | 'user_abuse'
}

type FilterInteractionType = Extract<
  InteractionType,
  'bookmark' | 'repost' | 'reply'
>

export type GetPostInteractionsRequest = PostIdRequest &
  (
    | {
        filters?: FilterInteractionType[]
      }
    | {
        exclude?: FilterInteractionType[]
      }
  )
export type SearchPostRequest = {
  q: string
  order?: SearchType
  tags?: string[]
  has_mentions?: boolean
  leading_mentions?: string[]
  links?: string[]
  link_domains?: string[]
  is_directed?: boolean
  is_revised?: boolean
  is_nsfw?: boolean
  is_reply?: boolean
  client_id?: string
  creator_id?: string
  reply_to?: string
  thread_id?: string
  user_types?: User.UserType[]
  raw_types: string[]
}
