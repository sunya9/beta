import { Plugin } from '@nuxt/types'

const plugin: Plugin = (context) => {
  // FIXME: dirty
  setTimeout(() => {
    const tokenStr = context.$auth.getToken('pnut')
    if (!tokenStr) return // ignore if not logged in
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
