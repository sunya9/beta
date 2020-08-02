import { Post } from '~/entity/post'
import { getImageURLs } from '~/assets/ts/util'

export function getHtmlMeta(post?: Post) {
  if (!post || !post.user || !post.content) return
  const name = post.user.name
    ? `${post.user.name}(@${post.user.username})`
    : `@${post.user?.username}`
  const fullTitle = `${name}: ${post.content?.text}`
  const title =
    fullTitle.length > 50 ? `${fullTitle.substr(0, 50)}…` : fullTitle
  const meta = [
    { hid: 'description', name: 'description', content: fullTitle },
    {
      hid: 'og:description',
      property: 'og:description',
      content: fullTitle,
    },
    { hid: 'og:title', property: 'og:title', content: title },
  ]
  const [photo] = getImageURLs(post, true)
  if (photo) {
    meta.push(
      {
        hid: 'og:image',
        property: 'og:image',
        content: photo.original,
      },
      {
        hid: 'og:image:width',
        property: 'og:image:width',
        content: photo.width.toString(),
      },
      {
        hid: 'og:image:height',
        property: 'og:image:height',
        content: photo.height.toString(),
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'article',
      },
      {
        hid: 'article:published_time',
        property: 'article:published_time',
        content: post.created_at.toString(),
      },
      {
        hid: 'article:author',
        property: 'article:author',
        content: post.user?.username || '',
      }
    )
  }
  return {
    title,
    meta,
  }
}
