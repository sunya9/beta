import { ExploreSlugType } from '~/plugins/domain/dto/post'
import { UserId } from '~/plugins/domain/dto/common'

export type StreamType =
  | { type: 'home'; unified: boolean }
  | { type: 'mentions' }
  | { type: 'bookmark'; userId: UserId }
  | { type: 'explore'; slug: ExploreSlugType }
  | { type: 'global' }
  | { type: 'hashtag'; tag: string }
  | { type: 'user'; userId: UserId }
