import Vue from 'vue'
import { getters } from '~/store'
import Vuex from 'vuex'
import { merge } from 'lodash'
import { RouterLinkStub as NuxtLink } from '@vue/test-utils'
import axiosMock from './axios-mock'
import fixtures from './fixtures'

beforeEach(() => {
  Vue.prototype.$toast = {
    error: jest.fn(),
    success: jest.fn()
  }
  Vue.prototype.$auth = {
    loginWith: jest.fn(),
    logout: jest.fn()
  }
})

function createStore() {
  const store = new Vuex.Store({
    getters
  })
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

const sleep = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds))

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
  authedUserCreateStore,
  baseMountOpts,
  axiosMock,
  fixtures,
  sleep
}

export * from '@vue/test-utils'
