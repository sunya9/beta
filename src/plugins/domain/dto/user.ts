import {
  IdsRequest,
  InteractionType,
  SearchType,
  Pagination,
} from '~/plugins/domain/dto/common'
import { User } from '~/models/user'

export type GeneralUserParameters = {
  include_html?: boolean
  include_user_html?: boolean
  include_counts?: boolean
  incldue_user?: boolean
  include_presense?: boolean
  include_raw?: boolean
  include_user_raw?: boolean
} & Pagination

export type UserIdRequest = {
  user_id: string
}

export type PutUserMeRequest = {
  locale: string
  timezone: string
  content?: {
    text: string
  }
  name: string
}

export type PatchUserMeRequest = Partial<PutUserMeRequest>
export type GetUserAvatarRequest = UserIdRequest
export type PostUserAvatarRequest = FormData | { from_url: string }
export type GetUserCoverRequest = UserIdRequest &
  (
    | {
        h: number
      }
    | { w: number }
  )
export type PostUserCoverRequest = FormData | { from_url: string }
export type GetUserRequest = UserIdRequest
export type GetUsersRequest = IdsRequest
export type GetUserFollowingRequest = UserIdRequest
export type GetUserFollowersRequest = UserIdRequest
export type FollowRequest = UserIdRequest
export type UnFollowRequest = UserIdRequest
type PresenceType = 1 | 0 | string
export type PutPrecenseRequest = {
  presence: PresenceType
}
export type GetUserIntractionsRequest =
  | {
      filters: InteractionType[]
    }
  | {
      exclude: InteractionType[]
    }
export type SearchUsersRequest = {
  q?: string
  order?: SearchType
  locale?: string
  timezone?: string
  types?: User.UserType[]
} & GeneralUserParameters &
  Pagination

export type GetInteractionParameters = {
  filters?: string
  exclude?: string
} & GeneralUserParameters &
  Pagination
