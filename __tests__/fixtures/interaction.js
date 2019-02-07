import fixtures from './'

const post = fixtures('post')

export default {
  event_date: new Date(),
  pagination_id: '1',
  users: [fixtures('user')],
  // dummy
  action: 'reply',
  objects: [post]
}

export const reply = {
  action: 'reply',
  objects: [post]
}

export const bookmark = {
  action: 'bookmark',
  objects: [post]
}

export const repost = {
  action: 'repost',
  objects: [post]
}
export const follow = {
  action: 'follow',
  objects: [fixtures('user', 'notMe')]
}
