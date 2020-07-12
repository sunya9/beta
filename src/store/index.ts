import { GetterTree } from 'vuex'
import {
  getAccessorType,
  getterTree,
  actionTree,
  mutationTree,
} from 'nuxt-typed-vuex'
import { Auth } from '@nuxtjs/auth'
import { Token } from '~/models/token'
import { PnutResponse } from '~/models/pnut-response'
import { User } from '~/models/user'

export type State = {
  auth: Partial<Auth<PnutResponse<Token>>> | null
  unreadMessages: boolean
  unreadHomeStream: boolean
  unreadMentions: boolean
}

export const state = (): State => ({
  auth: null,
  unreadMessages: false,
  unreadHomeStream: false,
  unreadMentions: false,
})

export const mutations = mutationTree(state, {
  updateUnreadMessages(state, newState: boolean) {
    state.unreadMessages = newState
  },
  updateUnreadHomeStream(state, newState: boolean) {
    state.unreadHomeStream = newState
  },
  updateUnreadMentions(state, newState: boolean) {
    state.unreadMentions = newState
  },
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

export const actions = actionTree(
  { state, getters, mutations: {} },
  {
    nuxtClientInit(): void {},
    async fetchUnread(): Promise<void> {
      const { hasUnread } = await this.$interactors.getUnreadCount.run(
        undefined
      )
      this.app.$accessor.updateUnreadMessages(hasUnread)
    },
  }
)

export const accessorType = getAccessorType({
  state,
  mutations,
  getters,
  actions,
})
