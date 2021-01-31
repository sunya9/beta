import { User } from '~/entity/user'
import { Token } from '~/entity/token'

export function loginAs(user?: User) {
  if (user) {
    const token: Token = {
      app: {
        id: 'test-app-id',
        link: 'https://example.com/test-app',
        name: 'test-app',
      },
      scopes: ['basic'],
      storage: {
        available: 1024 * 500,
        total: 1024 * 500,
      },
      user,
    }

    window.$nuxt.$auth.setUser({
      data: token,
      meta: {
        code: 200,
      },
    })
  } else {
    window.$nuxt.$auth.setUser()
  }
}
