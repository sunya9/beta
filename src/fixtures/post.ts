import { Factory } from 'rosie'
import { Post } from '~/entity/post'
import { user } from '~/fixtures/user'

export const post = new Factory<Post>().sequence('id').attrs({
  content: {
    entities: {
      links: [],
      tags: [],
      mentions: [],
    },
    links_not_parsed: false,
    text: 'body',
  },
  is_deleted: false,
  user: user.build(),
  created_at: new Date(),
  counts: {
    bookmarks: 1,
    replies: 2,
    reposts: 3,
    threads: 4,
  },
  source: {
    name: 'beta',
    link: 'https://beta.pnut.io',
    id: 'lorem',
  },
  you_bookmarked: false,
  you_reposted: false,
})
