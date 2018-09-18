import fixtures from './'

export default {
  id: '1',
  raw: [],
  owner: fixtures('user'),
  acl: {
    full: {
      user_ids: []
    },
    write: {
      user_ids: []
    },
    read: {
      user_ids: []
    }
  }
}

export const publicly = {
  acl: {
    read: {
      public: true
    }
  }
}

export const writable = {
  acl: {
    write: {
      you: true
    }
  }
}

export const chat = {
  raw: [
    {
      type: 'io.pnut.core.chat-settings',
      value: {
        name: 'name',
        description: 'description',
        categories: ['general']
      }
    }
  ]
}
