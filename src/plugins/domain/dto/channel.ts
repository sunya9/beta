export type GeneralChannelParameters = {
  include_read?: boolean
  channel_types?: string[]
  exclude_channel_types: string[]
  include_marker?: boolean
  include_inactive?: boolean
  include_raw?: boolean
  include_channel_raw?: boolean
  include_recent_message?: boolean
  include_limited_users?: boolean
}

export type ChannelIdRequest = {
  channel_id: string
}

type ChannelCategory =
  | 'fun'
  | 'lifestyle'
  | 'profession'
  | 'language'
  | 'community'
  | 'tech'
  | 'event'
  | 'general'
export type SearchChannelRequest = {
  order?: 'activity' | 'id' | 'popularity'
  q: string
  categories?: ChannelCategory[]
  channel_types?: string[]
  raw_types?: string[]
  exclude_channel_types?: string[]
  is_private?: boolean
  is_public?: boolean
  owner_id?: string
}
