import { Post, DefinitelyPost } from '~/entity/post'
import { User } from '~/entity/user'

function isEnabledNotification() {
  return localStorage.getItem('notification') === 'true'
}

export function sendPostNotification(posts: Post[]) {
  const enabled = localStorage.getItem('notification:posts') === 'true'
  if (!enabled || !isEnabledNotification()) return
  if (posts.length === 1) {
    const [post] = posts
    if (!post.content || !post.user || !post.user.content) return
    const { text: body } = post.content
    const {
      content: {
        avatar_image: { link: icon },
      },
    } = post.user
    const title = User.getTitle(post.user)
    const options = {
      icon,
      body,
    }
    return new Notification(title, options)
  } else {
    const count = posts.length
    const title = `Receive ${count} posts.`
    const options = {
      icon: '/img/beta.png',
    }
    return new Notification(title, options)
  }
}

function isDefinitelyPost(post: Post): post is DefinitelyPost {
  return !!post.content && !!post.user
}

export function sendMentionNotification(mentions: Post[]): Notification[] {
  const enabled = localStorage.getItem('notification:mentions') === 'true'
  if (!enabled || !isEnabledNotification()) return []
  return mentions
    .filter(isDefinitelyPost)
    .map((mention) => {
      const { text: body } = mention.content
      const {
        content: {
          avatar_image: { link: icon },
        },
      } = mention.user
      const title = User.getTitle(mention.user)
      const options = {
        icon,
        body,
      }
      return new Notification(title, options)
    })
    .filter((not) => !!not)
}
