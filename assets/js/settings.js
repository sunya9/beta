export function isEnabledUnifiedTimeline() {
  return window.localStorage.getItem('unified_timeline') === 'true'
}

export function isEnabledHideDirectedPosts() {
  return window.localStorage.getItem('hide_directed_posts') === 'true'
}
