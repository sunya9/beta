import { Auth } from '@nuxtjs/auth'
import { Token } from '~/models/token'
import { PnutResponse } from '~/models/pnut-response'
import { User } from '~/models/user'

function getData<T extends keyof Token>(
  auth: Partial<Auth<PnutResponse<Token>>> | null | undefined,
  key: T
): Token[T] | null {
  return (auth && auth.user && auth.user.data && auth.user.data[key]) || null
}

export type State = {
  auth?: Partial<Auth<PnutResponse<Token>>>
}

type Getters = {
  user: (state: State) => User | null
  storage: (state: State) => Token.Storage
}

export const getters: Getters = {
  user({ auth }) {
    return getData(auth, 'user')
  },
  storage({ auth }) {
    return (
      getData(auth, 'storage') || {
        available: 0,
        total: 0,
      }
    )
  },
}
