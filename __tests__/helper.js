import Vue from 'vue'

import VueRouter from 'vue-router'
import originalCreateStore from '~/store'
import { merge, cloneDeep } from 'lodash'
import { RouterLinkStub as NuxtLink } from '@vue/test-utils'
import axiosMock from './axios-mock'
import path from 'path'

function fixtures(filepath, overrides) {
  const defExport = require(path.resolve(__dirname, 'fixtures', filepath))
  return overrides
    ? merge({}, defExport.default, defExport[overrides])
    : cloneDeep(defExport.default)
}

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
