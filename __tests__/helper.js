import Vue from 'vue'
import VueRouter from 'vue-router'
import originalCreateStore from '~/store'
import { merge } from 'lodash'
import { RouterLinkStub as NuxtLink } from '@vue/test-utils'
import axiosMock from './axios-mock'
import fixtures from './fixtures'

beforeEach(() => {
  Vue.prototype.$toast = {
    error: jest.fn(),
    success: jest.fn()
  }
})

function createStore() {
  const store = originalCreateStore()
  store.replaceState({
    auth: {
      loggedIn: false,
      user: null
    }
  })
  return store
}

const authedUserCreateStore = () => {
  const store = createStore()
  store.replaceState({
    auth: {
      loggedIn: true,
      user: {
        data: {
          user: {
            username: 'foo',
            id: '1'
          },
          storage: {
            available: 1
          }
        }
      }
    }
  })
  return store
}

const baseMountOpts = (...overrides) =>
  merge(
    {},
    {
      stubs: {
        NuxtLink
      }
    },
    ...overrides
  )

export {
  createStore,
  VueRouter,
  authedUserCreateStore,
  baseMountOpts,
  axiosMock,
  fixtures
}

export * from '@vue/test-utils'
