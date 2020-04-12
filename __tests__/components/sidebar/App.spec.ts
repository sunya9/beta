import * as Vuex from 'vuex'
import Vue from 'vue'
import { Wrapper } from '@vue/test-utils'
import {
  authedUserCreateStore,
  mount,
  shallowMount,
  createStore,
  RouterLinkStub as NuxtLink,
  createLocalVue,
} from '../../helper'
import AppSidebar from '~/components/sidebar/App'

const menus = [
  'Your Stream',
  'Mentions',
  'Interactions',
  'Stars',
  'Conversations',
  'Missed Conversations',
  'Conversations',
  'Newcomers',
  'Photos',
  'Trending',
  'Global',
]

function getTrimmedText(wrapper: Wrapper<Vue>) {
  return wrapper.text().trim()
}

describe('App sidebar component', () => {
  let localVue: typeof Vue
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(Vuex)
  })
  test('Show all menus when logged in', () => {
    const wrapper = shallowMount(AppSidebar, {
      store: authedUserCreateStore(),
      mocks: {
        $route: {
          fullPath: '',
        },
      },
      localVue,
      stubs: {
        NuxtLink,
      },
    })

    expect(wrapper.findAll('.heading').wrappers.map(getTrimmedText)).toEqual(
      expect.arrayContaining(['Beta', 'Explore', 'Other'])
    )
    const links = wrapper.findAll('a')
    expect(links.wrappers.map(getTrimmedText)).toEqual(
      expect.arrayContaining(menus)
    )
  })

  test('Hide some menus when not logged in', () => {
    const wrapper = shallowMount(AppSidebar, {
      store: createStore(),
      localVue,
      mocks: {
        $route: {
          fullPath: '',
        },
      },
      stubs: {
        NuxtLink,
      },
    })

    expect(wrapper.findAll('.heading').wrappers.map(getTrimmedText)).toEqual(
      expect.arrayContaining(['Other'])
    )

    const links = wrapper.findAll('.list-group a')
    const texts = links.wrappers.map(getTrimmedText)
    expect(texts).not.toEqual(
      expect.arrayContaining([
        'Your Stream',
        'Mentions',
        'Interactions',
        'Stars',
        'Conversations',
        'Missed Conversations',
        'Conversations',
        'Newcomers',
        'Photos',
        'Trending',
        'Keyboard shortcuts',
      ])
    )
    expect(texts).toEqual(expect.arrayContaining(['About', 'Beta on GitHub']))
  })
  test('Show help modal when click keyboard shortcuts', () => {
    const wrapper = mount(AppSidebar, {
      store: authedUserCreateStore(),
      localVue,
      mocks: {
        $route: {
          fullPath: '',
        },
      },
      stubs: {
        NuxtLink,
      },
    })
    const keyboardLink = wrapper
      .findAll('a')
      .wrappers.find((wrapper) =>
        /Keyboard shortcuts/.test(wrapper.text().trim())
      )
    const fn = jest.fn()
    wrapper.vm.$modal.show = fn
    keyboardLink?.trigger('click')
    expect(fn).toHaveBeenCalledWith('help-modal')
  })
})
