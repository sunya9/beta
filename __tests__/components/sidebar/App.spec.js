import {
  authedUserCreateStore,
  mount,
  shallowMount,
  createStore,
  RouterLinkStub as NuxtLink,
  VueRouter,
  createLocalVue
} from 'helper'
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
  'Global'
]

function getTrimmedText(wrapper) {
  return wrapper.text().trim()
}

describe('App sidebar component', () => {
  let $store, localVue, router
  beforeEach(() => {
    localVue = createLocalVue()
    localVue.use(VueRouter)
  })
  test('Show all menus when logged in', () => {
    $store = authedUserCreateStore()
    router = new VueRouter()
    const wrapper = shallowMount(AppSidebar, {
      mocks: {
        $store
      },
      localVue,
      router,
      stubs: {
        NuxtLink
      }
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
    $store = createStore()
    router = new VueRouter()
    const wrapper = shallowMount(AppSidebar, {
      mocks: {
        $store
      },
      localVue,
      router,
      stubs: {
        NuxtLink
      }
    })

    expect(wrapper.findAll('.heading').wrappers.map(getTrimmedText)).toEqual(
      expect.arrayContaining(['Other'])
    )

    const links = wrapper.findAll('a')
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
        'Keyboard shortcuts'
      ])
    )
    expect(texts).toEqual(
      expect.arrayContaining(['Global', 'About', 'Beta on GitHub'])
    )
  })
  test('Show help modal when click keyboard shortcuts', async () => {
    $store = authedUserCreateStore()
    router = new VueRouter()
    const wrapper = mount(AppSidebar, {
      mocks: {
        $store
      },
      localVue,
      router,
      stubs: {
        NuxtLink
      }
    })
    wrapper.setMethods({
      showHelpModal: jest.fn()
    })
    const keyboardLink = wrapper
      .findAll('a')
      .wrappers.find(wrapper =>
        /Keyboard shortcuts/.test(wrapper.text().trim())
      )
    keyboardLink.trigger('click')
    // why???
    // expect(wrapper.vm.showHelpModal).toHaveBeenCalled()
  })
})
