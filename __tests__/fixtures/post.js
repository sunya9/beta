export default {
  entities: {
    links: [],
    tags: [],
    mentions: []
  },
  text: 'body'
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
  title: 'title',
  body: 'body'
}
