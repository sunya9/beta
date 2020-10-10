import fixtures from '.'
import { InteractionType } from '~/entity/interaction'
import { Post } from '~/entity/post'
import { User } from '~/entity/user'

const post = fixtures<Post>('post')

const baseInteraction: InteractionType = {
  event_date: new Date(),
  pagination_id: '1',
  users: [fixtures('user')],
  // dummy
  action: 'reply',
  objects: [post],
}
export default baseInteraction

export const reply: Partial<InteractionType> = {
  action: 'reply',
  objects: [post],
}

export const bookmark: Partial<InteractionType> = {
  action: 'bookmark',
  objects: [post],
}

export const repost: Partial<InteractionType> = {
  action: 'repost',
  objects: [post],
}
export const follow: Partial<InteractionType> = {
  action: 'follow',
  objects: [fixtures<User>('user', 'notMe')],
}
