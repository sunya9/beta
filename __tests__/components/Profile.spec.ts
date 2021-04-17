import VueRouter from 'vue-router'
import Vue from 'vue'
import { ThisTypedMountOptions, Wrapper } from '@vue/test-utils'
import flushPromises from 'flush-promises'
import {
  mount,
  createStore,
  shallowMount,
  createLocalVue,
  authedAccessor,
} from '../helper'
import Profile from '~/components/organisms/Profile.vue'
import * as userFixtures from '~/fixtures/user'

describe('Profile component', () => {
  let opts: ThisTypedMountOptions<Vue>

  beforeEach(() => {
    opts = {
      propsData: {
        initialProfile: userFixtures.anotherUser,
      },
      mocks: {
        $accessor: authedAccessor(),
      },
      stubs: {
        Thumb: true,
        CreatePmModal: true,
      },
    }
  })
  describe('Cover', () => {
    test('Show cover image', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.find('img').attributes().src).toContain(
        'https://via.placeholder.com/960x223'
      )
    })
  })
  describe('Userinfo', () => {
    test('Show a shield badge when verified domain', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.verifiedDomainUser,
        },
      })
      expect(wrapper.find('#profile-domain').exists()).toBe(true)
    })
    test('Hidden a shield badge when not verified domain', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.find('#profile-domain').exists()).toBe(false)
    })
    test('Show bio when content.text exists', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
      })
      expect(wrapper.find('.description').exists()).toBe(true)
    })
    test('Hidden bio when profile.text does not exist', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          initialProfile: userFixtures.withoutDescription,
        },
      })
      expect(wrapper.find('.description').exists()).toBe(false)
    })
  })
  test('counts', () => {
    const wrapper = mount(Profile, opts)
    const text = wrapper.find('#profile-counts').text()
    expect(text).toContain('5 Posts')
    expect(text).toContain('4 Follows')
    expect(text).toContain('3 Followers')
    expect(text).toContain('1 Starred')
  })
  describe('Me', () => {
    test('Not shown follow button', () => {
      const wrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.myselfEntity,
        },
      })
      expect(wrapper.find('follow-button-stub').exists()).toBe(false)
    })
  })
  describe('Everyone except me', () => {
    let wrapper: Wrapper<Vue>
    beforeEach(() => {
      wrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
      })
    })
    test('Show follow button', () => {
      expect(wrapper.find('follow-button-stub').exists()).toBe(true)
    })
    test('relation is not shown when another user not follow you', () => {
      wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
      })
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('')
    })
    test('relation is shown when another user follows you', () => {
      wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.followerUser,
        },
      })
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('Follows you')
    })
  })
  describe('more dropdown', () => {
    test('Show dropdown when three dots is clicked', async () => {
      const wrapper = mount(Profile, opts)
      const dropdownButton = wrapper.find(
        '[data-test-id="profile-dropdown"] > button'
      )
      expect(dropdownButton.attributes('aria-expanded')).toBe('false')
      await dropdownButton.trigger('click')
      await new Promise((resolve) => setTimeout(resolve, 10)) // dirty hack
      expect(dropdownButton.attributes('aria-expanded')).toBe('true')
    })
    test('Not show Block/Mute link in not my profile', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
      })
      const text = wrapper.text()
      expect(text).toContain('Block')
      expect(text).toContain('Mute')
    })
    test('Hide Block/Mute link in myself profile', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.myselfEntity,
        },
      })
      const text = wrapper.text()
      expect(text).not.toContain('Block')
      expect(text).not.toContain('Mute')
    })
    test('Show RSS link any user', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.text()).toContain('RSS')
    })
  })
  describe('Send a message button', () => {
    test('Show the button when logged in', () => {
      const wrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
      })
      expect(wrapper.find('[data-test-id="send-message"]').exists()).toBe(true)
    })
    test('Hidden the button when logged out or block or myself', () => {
      const selector = '[data-test-id="send-message"]'
      const myselfWrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          initialProfile: userFixtures.myselfEntity,
        },
      })
      expect(myselfWrapper.find(selector).exists()).toBe(false)
      const blockedWrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.blockedUser,
        },
      })
      expect(blockedWrapper.find(selector).exists()).toBe(false)
      const loggedoutWrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.myselfEntity,
        },
        mocks: {
          $store: createStore(),
        },
      })
      expect(loggedoutWrapper.find(selector).exists()).toBe(false)
    })
    test('Transition page when pm exists', async () => {
      const localVue = createLocalVue()
      localVue.use(VueRouter)
      const router = new VueRouter({
        routes: [
          {
            path: '/channels/:channel',
            name: 'channels-channel',
          },
        ],
      })
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
        mocks: {
          $accessor: {
            user: userFixtures.myselfEntity,
          },
          $interactors: {
            existingPm: {
              run: () =>
                Promise.resolve({
                  res: {
                    data: {
                      id: '1',
                    },
                  },
                }),
            },
          },
        },
        router,
        localVue,
      })
      await wrapper.find('[data-test-id="send-message"]').trigger('click')
      await flushPromises()

      expect(wrapper.vm.$route.fullPath).toBe('/channels/1')
    })
    test('Show modal when pm not exist', async () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
        mocks: {
          $accessor: {
            user: userFixtures.myselfEntity,
          },
          $interactors: {
            existingPm: {
              run: () => Promise.reject(new Error('Not found')),
            },
          },
        },
      })
      const fn = jest.fn()
      wrapper.vm.$modal.show = fn
      await wrapper.find('[data-test-id="send-message"]').trigger('click')
      await flushPromises()
      expect(fn).toHaveBeenCalled()
    })
  })
  describe('logged out', () => {
    test('Follow button is hidden', () => {
      const wrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: userFixtures.anotherUser,
        },
        mocks: {
          $store: createStore(),
        },
      })
      expect(wrapper.find('follow-button-stub').exists()).toBe(false)
    })
  })
})
