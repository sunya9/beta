import Header from '~/components/Header'

import {
  shallowMount,
  createStore,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink
} from 'helper'
import { defaultsDeep } from 'lodash'

describe('Header component', () => {
  let $store, authedStore, opts, authOpts
  const baseOpts = defaultsDeep({
    stubs: {
      NuxtLink,
      SearchForm: '<div/>'
    }
  })
  beforeEach(() => {
    $store = createStore()
    authedStore = authedUserCreateStore()
    opts = defaultsDeep({}, baseOpts, {
      mocks: {
        $store
      }
    })
    authOpts = defaultsDeep({}, baseOpts, {
      mocks: {
        $store: authedStore
      }
    })
  })
  test('Hide search form when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.contains('#search-form')).toBe(false)
  })
  test('Show search form when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.contains('#search-form')).toBe(true)
  })

  test('Hide user menu when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.contains('#user-menu')).toBe(false)
  })
  test('Show user menu when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.contains('#user-menu')).toBe(true)
  })

  test('Hide files link when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.contains('#nav-files')).toBe(false)
  })

  test('Show files link when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.contains('#nav-files')).toBe(true)
  })

  test('Hide messages link when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.contains('#nav-messages')).toBe(false)
  })

  test('Show messages link when logged in', async () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.contains('#nav-messages')).toBe(true)
  })
})
