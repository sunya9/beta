import fixtures from '.'
import { Interaction } from '~/entity/interaction'
import { Post } from '~/entity/post'
import { User } from '~/entity/user'

const post = fixtures<Post>('post')

const baseInteraction: Interaction = {
  event_date: new Date(),
  pagination_id: '1',
  users: [fixtures('user')],
  // dummy
  action: 'reply',
  objects: [post],
}
export default baseInteraction

export const reply: Partial<Interaction> = {
  action: 'reply',
  objects: [post],
}

export const bookmark: Partial<Interaction> = {
  action: 'bookmark',
  objects: [post],
}

export const repost: Partial<Interaction> = {
  action: 'repost',
  objects: [post],
}
export const follow: Partial<Interaction> = {
  action: 'follow',
  objects: [fixtures<User>('user', 'notMe')],
}
