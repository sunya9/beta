import { GetterTree } from 'vuex'
import { getAccessorType, getterTree } from 'nuxt-typed-vuex'
import { Auth } from '@nuxtjs/auth'
import { Token } from '~/models/token'
import { PnutResponse } from '~/models/pnut-response'
import { User } from '~/models/user'

export type State = {
  auth: Partial<Auth<PnutResponse<Token>>> | null
}

export const state = (): State => ({
  auth: null,
})

export const rawGetters: GetterTree<State, any> = {
  user({ auth }): User | null {
    return auth?.user?.data?.user || null
  },
  storage({ auth }): Token.Storage {
    return (
      auth?.user?.data?.storage ?? {
        available: 0,
        total: 0,
      }
    )
  },
}

export const getters = getterTree(state, {
  user({ auth }): User | null {
    return auth?.user?.data?.user || null
  },
  storage({ auth }): Token.Storage {
    return (
      auth?.user?.data?.storage ?? {
        available: 0,
        total: 0,
      }
    )
  },
})

export const accessorType = getAccessorType({
  state,
  getters,
})
