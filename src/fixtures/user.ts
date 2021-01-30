import { Factory } from 'rosie'
import { User } from '~/entity/user'

export const user = new Factory<User>().attrs({
  id: '2',
  content: {
    avatar_image: {
      height: 256,
      width: 256,
      is_default: false,
      link: 'https://via.placeholder.com/256',
    },
    cover_image: {
      width: 960,
      height: 223,
      is_default: false,
      link: 'https://via.placeholder.com/960x223',
    },
    entities: {
      links: [
        {
          amended_len: 18,
          len: 4,
          link: 'https://example.com',
          pos: 0,
          text: 'test [example.com]',
        },
      ],
      mentions: [],
      tags: [],
    },
    html:
      '<span itemscope itemtype="https://pnut.io/schemas/Post"><a href="https://example.com">test</a> [example.com]</span>',
    text: 'test [example.com]',
  },
  badge: {
    id: '1',
    name: 'farmer',
  },
  counts: {
    bookmarks: 1,
    clients: 2,
    followers: 3,
    following: 4,
    posts: 5,
    users: 6,
  },
  created_at: new Date('2020-01-01'),
  username: 'test',
  follows_you: true,
  you_blocked: false,
  you_follow: true,
  you_muted: false,
  you_can_follow: false,
  locale: 'ja_JP',
  name: 'test',
  timezone: 'Asia/Tokyo',
  type: User.UserType.human,
})

export const myself = user.build({
  follows_you: true,
  you_blocked: false,
  you_follow: true,
  you_muted: false,
  you_can_follow: false,
  id: '1',
})
