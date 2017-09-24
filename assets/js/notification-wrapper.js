import { getTitle } from './util'

function isEnabledNotification () {
  return localStorage.getItem('notification') === 'true'
}

export function sendPostNotification (posts) {
  const enabled = localStorage.getItem('notification:posts') === 'true'
  if (!enabled || !isEnabledNotification()) return
  if (posts.length === 1) {
    const [post] = posts
    const { text: body } = post.content
    const { content: { avatar_image: { link: icon } } } = post.user
    const title = getTitle(post.user)
    const options = {
      icon,
      body
    }
    return new Notification(title, options)
  } else {
    const count = posts.length
    const title = `Receive ${count} posts.`
    const options = {
      icon: '/img/beta.png'
    }
    return new Notification(title, options)
  }
}

export function sendMentionNotification (mentions) {
  const enabled = localStorage.getItem('notification:mentions') === 'true'
  if (!enabled || !isEnabledNotification()) return
  return mentions.map(mention => {
    const { text: body } = mention.content
    const {
      content: {
        avatar_image: {
          link: icon
        }
      }
    } = mention.user
    const title = getTitle(mention.user)
    const options = {
      icon,
      body
    }
    return new Notification(title, options)
  })
}
