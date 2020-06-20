import { Pageable } from './pageable'
import { Post } from './post'
import { User } from './user'
import { Poll } from '~/models/poll'

interface BaseInteraction<T> extends Pageable {
  event_date: Date
  action: Interaction.ActionType
  objects: T[]
}
export type Interaction =
  | Interaction.Bookmark
  | Interaction.Reply
  | Interaction.Repost
  | Interaction.Follow
  | Interaction.PollResponse

export namespace Interaction {
  export type ActionType =
    | 'bookmark'
    | 'reply'
    | 'repost'
    | 'follow'
    | 'poll_response'
  export interface Bookmark extends BaseInteraction<Post> {
    action: 'bookmark'
  }

  export interface Reply extends BaseInteraction<Post> {
    action: 'reply'
  }

  export interface Repost extends BaseInteraction<Post> {
    action: 'repost'
  }

  export interface Follow extends BaseInteraction<User> {
    action: 'follow'
  }

  export interface PollResponse extends BaseInteraction<Poll> {
    action: 'poll_response'
  }
}
