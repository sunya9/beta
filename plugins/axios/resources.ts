import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'

type RouteLike = { params: Dictionary<string> }
type RouteGetter = ((route: RouteLike) => string) | string

const map: {
  [key: string]: RouteGetter;
} = {
  index: '/posts/streams/me',
  mentions: '/users/me/mentions',
  interactions: '/users/me/actions',
  stars: '/users/me/bookmarks',
  conversations: '/posts/streams/explore/conversations',
  'missed-conversations': '/posts/streams/explore/missed_conversations',
  photos: '/posts/streams/explore/photos',
  trending: '/posts/streams/explore/trending',
  global: '/posts/streams/global',
  'posts-id': ({ params }) => `/posts/${params.id}/thread`,
  'posts-id-revisions': ({ params }) => `/posts/${params.id}/revisions`,
  'tags-name': ({ params }) => `/posts/tag/${encodeURIComponent(params.name)}`,
  '@name': ({ params }) => `/users/@${params.name}/posts`,
  '@name-follows': ({ params }) => `/users/@${params.name}/following`,
  '@name-followers': ({ params }) => `/users/@${params.name}/followers`,
  '@name-starred': ({ params }) => `/users/@${params.name}/bookmarks`,
  '@name-posts-id': ({ params }) => `/posts/${params.id}/thread`,
  files: '/users/me/files',
  'files-id': ({ params }) => `/files/${params.id}`,
  'search-users': '/users/search',
  'search-posts': '/posts/search',
  messages: '/channels/search',
  'messages-public': '/users/me/channels/subscribed',
  'messages-public-all': '/channels/search',
  'messages-channel': ({ params }) => `/channels/${params.channel}/messages`,
  'about-stats': '/sys/stats',
  newcomers: '/posts/streams/explore/newcomers',
  polls: '/users/me/polls',
  'polls-id': ({ params }) => `/polls/${params.id}`,
  'settings-blocked-accounts': '/users/me/blocked',
  'settings-muted-accounts': '/users/me/muted'
}

function isString(route: Route | string): route is string {
  return typeof route === 'string'
}

function getKey(route: Route | string): string | null {
  if (isString(route)) {
    return route
  } else {
    return route.name || null
  }
}

function getValue(route: Route | string): RouteGetter | null {
  const key = getKey(route)
  if (!key) return key
  return map[key]
}

export function convertPageId2ApiPath(route: Route | string): string | null {
  const val = getValue(route)
  const params = isString(route) ? {} : route.params
  return typeof val === 'function' ? val({ params }) : val
}
