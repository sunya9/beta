import fixtures from '.'
import { Interaction } from '~/models/interaction'
import { Post } from '~/models/post'
import { User } from '~/models/user'

const post = fixtures<Post>('post')

const baseInteraction: Interaction<Post> = {
  event_date: new Date(),
  pagination_id: '1',
  users: [fixtures('user')],
  // dummy
  action: 'reply',
  objects: [post],
}
export default baseInteraction

export const reply: Partial<Interaction<Post>> = {
  action: 'reply',
  objects: [post],
}

export const bookmark: Partial<Interaction<Post>> = {
  action: 'bookmark',
  objects: [post],
}

export const repost: Partial<Interaction<Post>> = {
  action: 'repost',
  objects: [post],
}
export const follow: Partial<Interaction<User>> = {
  action: 'follow',
  objects: [fixtures<User>('user', 'notMe')],
}
