import Vue from 'vue'
import Vuex from 'vuex'
import { merge } from 'lodash'
import {
  RouterLinkStub as NuxtLink,
  ThisTypedMountOptions,
} from '@vue/test-utils'
import { useAccessor } from 'nuxt-typed-vuex'
import axiosMock from './axios-mock'
import fixtures from './fixtures'
import { getters, State, accessorType } from '~/store'
import { User } from '~/entity/user'

function createStore() {
  const store = new Vuex.Store<State>({
    getters,
  })
  store.replaceState({
    ...store.state,
    auth: {
      ...store.state.auth,
      loggedIn: false,
    },
  })
  return store
}

const authedUserCreateStore = () => {
  const store = createStore()
  store.replaceState({
    ...store.state,
    auth: {
      ...store.state.auth,
      loggedIn: true,
      user: {
        data: {
          scopes: [],
          app: {
            id: '',
            link: '',
            name: 'test',
          },
          user: {
            ...fixtures<User>('user'),
            username: 'foo',
            id: '1',
          },
          storage: {
            available: 1,
            total: 100,
          },
        },
      },
    },
  })
  return store
}

export const authedAccessor = () => {
  const store = authedUserCreateStore()
  const state = store.state
  const accessor = useAccessor(store, { state, getters })
  // const accessorMock: {
  // [T in keyof typeof accessorType]: typeof accessorType[T]
  // }
  const accessorMock: Pick<typeof accessorType, 'auth' | 'user' | 'storage'> = {
    auth: accessor.auth,
    user: accessor.user,
    storage: accessor.storage,
  }
  return accessorMock
}

const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

const baseMountOpts = <T extends Vue>(
  ...overrides: ThisTypedMountOptions<T>[]
) =>
  merge(
    {},
    {
      stubs: {
        NuxtLink,
      },
    },
    ...overrides
  )

const stub = Vue.extend({
  functional: true,
  render: (h, context) => h('div', context.data, context.children),
})

export {
  createStore,
  authedUserCreateStore,
  baseMountOpts,
  axiosMock,
  fixtures,
  sleep,
  stub,
}

export * from '@vue/test-utils'
