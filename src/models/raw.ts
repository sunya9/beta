import { Quote } from '~/models/raw/raw/quote'
import { LivePhoto } from '~/models/raw/raw/live-photo'
import { PollNotice, PollNoticeReplacement } from '~/models/raw/raw/poll-notice'
import { Language } from '~/models/raw/raw/language'
import { FallbackUrl } from '~/models/raw/raw/fallback-url'
import { ExternalUserProfiles } from '~/models/raw/raw/external-user-profiles'
import { ChannelAvatarImage } from '~/models/raw/raw/channel-avatar-image'
import { LongPost } from '~/models/raw/raw/long-post'
import { ChannelCoverImage } from '~/models/raw/raw/channel-cover-image'
import { ChannelInvite } from '~/models/raw/raw/channel-invite'
import { ChatRoomSettings } from '~/models/raw/raw/chat-room-settings'
import { OEmbed } from '~/models/raw/raw/oembed'
import { Crosspost } from '~/models/raw/raw/crosspost'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { ReplacementFileRaw } from '~/models/raw/replacement-values/file'

export type Raw =
  | Quote
  | LivePhoto
  | PollNotice
  | PollNoticeReplacement
  | Language
  | FallbackUrl
  | ExternalUserProfiles
  | LongPost
  | ChannelAvatarImage
  | ChannelCoverImage
  | ChannelInvite
  | ChatRoomSettings
  | OEmbed
  | Crosspost
  | Spoiler
  | ReplacementFileRaw

export interface BaseRaw {
  type: string
  value: any
}

export interface HasRaw {
  raw?: Raw[]
}
