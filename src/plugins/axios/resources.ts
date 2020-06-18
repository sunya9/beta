import { Route } from 'vue-router'
import { PnutResponse } from '~/models/pnut-response'

// TODO: define types for resource option
interface Dictionary {
  [key: string]: string | number | null
}

type RouteLike = { params: Dictionary }
type RouteGetter = (route: RouteLike) => string

const map: {
  [key: string]: RouteGetter
} = {
  index: () => '/posts/streams/me',
  mentions: () => '/users/me/mentions',
  interactions: () => '/users/me/actions',
  stars: () => '/users/me/bookmarks',
  conversations: () => '/posts/streams/explore/conversations',
  'missed-conversations': () => '/posts/streams/explore/missed_conversations',
  photos: () => '/posts/streams/explore/photos',
  trending: () => '/posts/streams/explore/trending',
  global: () => '/posts/streams/global',
  'posts-id': ({ params }) => `/posts/${params.id}/thread`,
  'posts-id-revisions': ({ params }) => `/posts/${params.id}/revisions`,
  'tags-name': ({ params }) => {
    const tag: string = params.name ? `${params.name}` : ''
    return `/posts/tag/${encodeURIComponent(tag)}`
  },
  '@name': ({ params }) => `/users/@${params.name}/posts`,
  '@name-follows': ({ params }) => `/users/@${params.name}/following`,
  '@name-followers': ({ params }) => `/users/@${params.name}/followers`,
  '@name-starred': ({ params }) => `/users/@${params.name}/bookmarks`,
  '@name-posts-id': ({ params }) => `/posts/${params.id}/thread`,
  files: () => '/users/me/files',
  'files-id': ({ params }) => `/files/${params.id}`,
  'search-users': () => '/users/search',
  'search-posts': () => '/posts/search',
  channels: () => '/channels/search',
  'channels-public': () => '/users/me/channels/subscribed',
  'channels-public-all': () => '/channels/search',
  'channels-channelId': ({ params }) =>
    `/channels/${params.channelId}/messages`,
  'about-stats': () => '/sys/stats',
  newcomers: () => '/posts/streams/explore/newcomers',
  polls: () => '/users/me/polls',
  'polls-id': ({ params }) => `/polls/${params.id}`,
  'settings-blocked-accounts': () => '/users/me/blocked',
  'settings-muted-accounts': () => '/users/me/muted',
}

function isString(route: Route | string): route is string {
  return typeof route === 'string'
}

function getKey(route: Route | string): string {
  if (isString(route)) {
    return route
  } else if (route.name) {
    return route.name
  } else {
    throw new Error('Cannot get resource url')
  }
}

function getRouteGetter(route: Route | string): RouteGetter {
  return map[getKey(route)]
}

export function convertPageId2ApiPath(route: Route | string): string {
  const routeGetter = getRouteGetter(route)
  const params = isString(route) ? {} : route.params
  return routeGetter({ params })
}

// type PredictedResource =  <T>(options?: Dictionary) => PnutResponse<T>
// type PredictedResource =  <T>(url: string, options: Dictionary) => PnutResponse<T>
export type Resource = <T>(option?: {
  url?: string
  options?: object
}) => Promise<PnutResponse<T>>
