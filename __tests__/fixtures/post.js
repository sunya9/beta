import fixtures from './'

export default {
  id: '1',
  content: {
    entities: {
      links: [],
      tags: [],
      mentions: []
    },
    text: 'body'
  },
  is_deleted: false,
  user: fixtures('user'),
  created_at: new Date(),
  counts: {
    bookmarks: 1,
    replies: 2,
    reposts: 3,
    threads: 4
  },
  source: {
    name: 'beta',
    link: 'https://beta.pnut.io',
    id: 'lorem'
  },
  you_bookmarked: false,
  you_reposted: false
}
const patterLink = 'https://patter.chat/room/0'

export const hasPatterLink = {
  content: {
    entities: {
      links: [
        {
          text: patterLink,
          len: patterLink.length,
          link: patterLink,
          pos: 0
        }
      ],
      tags: [],
      mentions: []
    },
    text: patterLink
  }
}

export const hasLongpost = {
  raw: [
    {
      type: 'nl.chimpnut.blog.post',
      value: {
        title: 'title',
        body: 'body'
      }
    }
  ]
}

// TODO: content should be deleted
export const deleted = {
  is_deleted: true
}

const betaLink = 'Beta [beta.pnut.io]'

export const hasMarkdownLink = {
  content: {
    entities: {
      links: [
        {
          text: betaLink,
          len: 4, // "Beta".length
          link: 'https://beta.pnut.io',
          pos: 0,
          amended_len: betaLink.length
        }
      ],
      tags: [],
      mentions: []
    },
    text: betaLink
  }
}

export const replyTo = {
  reply_to: '1',
  id: '2',
  user: fixtures('user', 'notMe')
}

export const main = {
  bookmarked_by: [],
  reposted_by: []
}
