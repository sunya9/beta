import {
  ReportReasonType,
  SearchType,
  RawRequest,
} from '~/plugins/domain/dto/common'
import { User } from '~/models/user'

export type GeneralMessageParameters = {
  include_deleted?: boolean
  include_html?: boolean
  include_message_html?: boolean
  include_raw?: boolean
  include_message_raw?: boolean
  include_client?: boolean
}

export type CreateMessageRequest = {
  text: string
  reply_to?: string
  is_nsfw?: boolean
  entities?: {
    parse_links?: boolean
    parse_markdown_links?: boolean
  }
} & RawRequest

export type MessageIdRequest = { message_id: string }
export type ReportMessageRequest = {
  reason: ReportReasonType
}
export type SeachMessageRequest = {
  q: string
  order?: SearchType
  channel_ids: string[]
  tags?: string[]
  mentions?: string[]
  leading_mentions: string[]
  links?: string[]
  link_domains?: string[]
  is_nsfw?: boolean
  is_reply?: boolean
  is_sticky?: boolean
  client_id?: string
  creator_id?: string
  reply_to?: string
  thread_id?: string
  user_types?: User.UserType[]
  raw_types?: string[]
}
