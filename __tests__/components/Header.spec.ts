import * as Vuex from 'vuex'
import { defaultsDeep } from 'lodash'
import { ThisTypedMountOptions } from '@vue/test-utils'
import {
  shallowMount,
  createStore,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  stub,
  authedAccessor,
} from '../helper'
import { State } from '~/store'
import Header from '~/components/Header.vue'

describe('Header component', () => {
  let $store: Vuex.Store<State>
  let authedStore: Vuex.Store<State>
  let opts: ThisTypedMountOptions<Vue>
  let authOpts: ThisTypedMountOptions<Vue>
  const baseOpts = defaultsDeep({
    stubs: {
      NuxtLink,
      SearchForm: stub,
    },
  })
  beforeEach(() => {
    $store = createStore()
    authedStore = authedUserCreateStore()
    opts = defaultsDeep({}, baseOpts, {
      mocks: {
        $store,
      },
    })
    authOpts = defaultsDeep({}, baseOpts, {
      mocks: {
        $store: authedStore,
        $accessor: authedAccessor(),
      },
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

  test('Show messages link when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.contains('#nav-messages')).toBe(true)
  })
})
