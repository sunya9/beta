import { Raw } from '~/models/raw'

export type Pagination = {
  since_id?: string
  before_id?: string
  count?: number
}

export type IdsRequest = {
  ids: string[]
}

export type InteractionType =
  | 'bookmark'
  | 'repost'
  | 'reply'
  | 'follow'
  | 'poll_response'
export type SearchType = 'id' | 'relevance'
export type ReportReasonType =
  | 'account_type'
  | 'nsfw'
  | 'soliciting'
  | 'user_abuse'

export type RawRequest = {
  raw?: Raw<any>[]
}

export type UserId = string | 'me'

export interface FetchMoreResult<T> {
  size: number
  data: T[]
}

export type ConnectionParameters = {
  connection_id?: string
}
