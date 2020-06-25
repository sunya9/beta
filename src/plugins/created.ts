import { Plugin } from '@nuxt/types'

const plugin: Plugin = (context) => {
  // FIXME: dirty
  setTimeout(() => {
    const accessToken = context.$auth.getToken('pnut').split(' ')[1]
    context.app.$interactors.createConnection.run({
      accessToken,
      newMessageHandler: () => context.app.$accessor.updateUnreadMessages(true),
    })
  }, 0)
}

export default plugin
