import { Plugin } from '@nuxt/types'
import type { Oauth2Scheme, Scheme } from '@nuxtjs/auth-next'

const isOAuth2Scheme=  (scheme: Scheme): scheme is Oauth2Scheme => {
  return 'token' in scheme
}

const plugin: Plugin = (context) => {
  // FIXME: dirty
  setTimeout(() => {
    const strategy = context.$auth.strategy
    if(!isOAuth2Scheme(strategy)) return;
    const tokenStr = strategy.token.get()
    if (!tokenStr || typeof tokenStr !== 'string') return // ignore if not logged in
    const accessToken = tokenStr.split(' ')[1]
    context.app.$interactors.createConnection.run({
      accessToken,
      handlers: {
        newChannelMesssageHandler: () => {}, // TODO
        newHomeStreamHandler: () =>
          context.app.$accessor.updateUnreadHomeStream(true),
        newMentionHandler: () =>
          context.app.$accessor.updateUnreadMentions(true),
        newAnyMesssageHandler: () =>
          context.app.$accessor.updateUnreadMessages(true),
      },
      connectionError: () => {}, // TODO
    })
  }, 0)
}

export default plugin
