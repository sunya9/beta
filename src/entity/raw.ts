import { Quote } from '~/entity/raw/raw/quote'
import { LivePhoto } from '~/entity/raw/raw/live-photo'
import { PollNotice, PollNoticeReplacement } from '~/entity/raw/raw/poll-notice'
import { Language } from '~/entity/raw/raw/language'
import { FallbackUrl } from '~/entity/raw/raw/fallback-url'
import { ExternalUserProfiles } from '~/entity/raw/raw/external-user-profiles'
import { ChannelAvatarImage } from '~/entity/raw/raw/channel-avatar-image'
import { LongPost } from '~/entity/raw/raw/long-post'
import { ChannelCoverImage } from '~/entity/raw/raw/channel-cover-image'
import { ChannelInvite } from '~/entity/raw/raw/channel-invite'
import { ChatRoomSettings } from '~/entity/raw/raw/chat-room-settings'
import { OEmbedType } from '~/entity/raw/raw/oembed'
import { Crosspost } from '~/entity/raw/raw/crosspost'
import { Spoiler } from '~/entity/raw/raw/spoiler'
import { ReplacementFileRaw } from '~/entity/raw/replacement-values/file'

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
  | OEmbedType
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
