import { Pageable } from './pageable'
import { Post } from './post'
import { User } from './user'

export interface Interaction<T> extends Pageable {
  event_date: Date
  action: Interaction.ActionType
  objects: T[]
  users?: User[]
}

export namespace Interaction {
  export type ActionType =
    | 'bookmark'
    | 'reply'
    | 'repost'
    | 'follow'
    | 'poll_response'
  export interface PostInteraction extends Interaction<Post> {}
}
