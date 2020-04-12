import fixtures from '.'
import { Channel } from '~/models/channel'

const baseChannel: Channel = {
  id: '1',
  raw: [],
  owner: fixtures('user'),
  acl: {
    full: {
      user_ids: [],
      immutable: true,
      you: false,
    },
    write: {
      user_ids: [],
      any_user: true,
      immutable: true,
      you: true,
    },
    read: {
      user_ids: [],
      any_user: true,
      immutable: true,
      public: true,
      you: true,
    },
  },
  counts: {
    messages: 1,
    subscribers: 1,
  },
  has_unread: false,
  is_active: true,
  type: 'net.unsweets.beta',
  you_muted: false,
  you_subscribed: true,
}

export const publicly = {
  acl: {
    read: {
      public: true,
    },
  },
}

export default baseChannel

export const writable = {
  acl: {
    write: {
      you: true,
    },
  },
}

export const chat = {
  raw: [
    {
      type: 'io.pnut.core.chat-settings',
      value: {
        name: 'name',
        description: 'description',
        categories: ['general'],
      },
    },
  ],
}
