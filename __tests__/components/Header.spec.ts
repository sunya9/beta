import Vue from 'vue'
import * as Vuex from 'vuex'
import VueRouter from 'vue-router'
import { defaultsDeep } from 'lodash'
import { ThisTypedMountOptions, createLocalVue, mount } from '@vue/test-utils'
import {
  shallowMount,
  createStore,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  stub,
  authedAccessor,
} from '../helper'
import { State } from '~/store'
import Header from '~/components/organisms/Header.vue'

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
    const localVue = createLocalVue()
    localVue.use(VueRouter)
    const router = new VueRouter()
    opts = defaultsDeep({}, baseOpts, {
      mocks: {
        $store,
      },
      localVue,
      router,
    })
    authOpts = defaultsDeep({}, baseOpts, {
      mocks: {
        $store: authedStore,
        $accessor: authedAccessor(),
      },
      localVue,
      router,
    })
  })
  test('Hide search form when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.find('#search-form').exists()).toBe(false)
  })
  test('Show search form when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.find('#search-form').exists()).toBe(true)
  })

  test('Hide user menu when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.find('#user-menu').exists()).toBe(false)
  })
  test('Show user menu when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.find('#user-menu').exists()).toBe(true)
  })

  test('Hide files link when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.find('#nav-files').exists()).toBe(false)
  })

  test('Show files link when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.find('#nav-files').exists()).toBe(true)
  })

  test('Hide messages link when not logged in', () => {
    const wrapper = shallowMount(Header, opts)
    expect(wrapper.find('#nav-messages').exists()).toBe(false)
  })

  test('Show messages link when logged in', () => {
    const wrapper = shallowMount(Header, authOpts)
    expect(wrapper.find('#nav-messages').exists()).toBe(true)
  })

  test('Toggle glovalNavigation when click humberger menu', async () => {
    const wrapper = mount(Header, opts)
    const globalNavigation = wrapper.find('#globalNavigation')
    expect(globalNavigation.isVisible()).toBe(false)
    await wrapper.find("[aria-controls='globalNavigation']").trigger('click')
    await wrapper.vm.$nextTick()
    expect(globalNavigation.isVisible()).toBe(true)
  })

  test('Close glovalNavigation when change route', async () => {
    const wrapper = mount(Header, opts)
    const globalNavigation = wrapper.find('#globalNavigation')
    expect(globalNavigation.isVisible()).toBe(false)
    await wrapper.find("[aria-controls='globalNavigation']").trigger('click')
    await wrapper.vm.$nextTick()
    expect(globalNavigation.isVisible()).toBe(true)
    await wrapper.vm.$router.push('/test')
    // FIXME
    await new Promise((resolve) => setTimeout(resolve, 150))
    expect(globalNavigation.isVisible()).toBe(false)
  })
})
