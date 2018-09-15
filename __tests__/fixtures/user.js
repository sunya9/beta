export default {
  id: '1',
  username: 'username',
  content: {
    cover_image: {
      link: 'https://example.com/cover.png',
      width: 960,
      height: 640
    },
    avatar_image: {
      link: 'https://example.com/avatar.png',
      width: 128,
      height: 128,
      is_default: false
    }
  },
  counts: {
    posts: 1,
    following: 2,
    followers: 3,
    bookmarks: 4
  },
  follows_you: false
}

export const hasVerifiedDomain = {
  verified: {
    domain: 'example.com',
    link: 'https://example.com'
  }
}

export const notMe = {
  id: '2',
  username: 'bob'
}

export const followsYou = {
  id: '2',
  follows_you: true
}

export const hasBio = {
  content: {
    text: 'bio'
  }
}

export const newAvatar = {
  content: {
    avatar_image: {
      is_default: false,
      width: 100,
      height: 100,
      link: 'http://example.com/new.png'
    }
  }
}

export const blocked = {
  you_blocked: true
}

export const carol = {
  id: 3,
  username: 'carol'
}
