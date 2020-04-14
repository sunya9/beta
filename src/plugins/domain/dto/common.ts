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
