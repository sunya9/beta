import VueRouter from 'vue-router'
import Vue from 'vue'
import { ThisTypedMountOptions, Wrapper } from '@vue/test-utils'
import {
  mount,
  createStore,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  shallowMount,
  fixtures,
  createLocalVue,
  sleep,
} from '../helper'
import Profile from '~/components/Profile.vue'
import CreatePmModal from '~/components/CreatePmModal.vue'
import { User } from '~/models/user'

type ProfileType = Vue & typeof Profile

describe('Profile component', () => {
  let opts: ThisTypedMountOptions<ProfileType>

  beforeEach(() => {
    const user = fixtures<User>('user')
    opts = {
      propsData: {
        initialProfile: user,
      },
      mocks: {
        $store: authedUserCreateStore(),
      },
      attachToDocument: true,
      stubs: {
        Thumb: true,
        NuxtLink,
        CreatePmModal,
      },
    }
  })
  describe('Cover', () => {
    test('Show cover image', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.find('img').attributes().src).toContain('cover.png')
    })
  })
  describe('Userinfo', () => {
    test('Show a shield badge when verified domain', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'hasVerifiedDomain'),
        },
      })
      expect(wrapper.contains('#profile-domain')).toBe(true)
    })
    test('Hidden a shield badge when not verified domain', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.contains('#profile-domain')).toBe(false)
    })
    test('Show bio when content.text exists', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'hasBio'),
        },
      })
      expect(wrapper.contains('.description')).toBe(true)
    })
    test('Hidden bio when profile.text does not exist', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.contains('.description')).toBe(false)
    })
  })
  test('counts', () => {
    const wrapper = mount(Profile, opts)
    const text = wrapper.find('#profile-counts').text()
    expect(text).toContain('1 Posts')
    expect(text).toContain('2 Follows')
    expect(text).toContain('3 Followers')
    expect(text).toContain('4 Starred')
  })
  describe('Me', () => {
    test('Not shown follow button', () => {
      const wrapper = shallowMount(Profile, opts)
      expect(wrapper.contains('follow-button-stub')).toBe(false)
    })
  })
  describe('Everyone except me', () => {
    let wrapper: Wrapper<ProfileType>
    beforeEach(() => {
      wrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'notMe'),
        },
      })
    })
    test('Show follow button', () => {
      expect(wrapper.contains('follow-button-stub')).toBe(true)
    })
    test('relation is not shown when another user not follow you', () => {
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('')
    })
    test('relation is shown when another user follows you', () => {
      wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'followsYou'),
        },
      })
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('Follows you')
    })
  })
  describe('more dropdown', () => {
    test('Show dropdown when three dots is clicked', () => {
      const wrapper = mount(Profile, opts)
      const dropdownWrapper = wrapper.find('#profile-dropdown')
      expect(dropdownWrapper.is('[aria-expanded="false"]')).toBe(true)
      wrapper.find('#profile-dropdown-trigger').trigger('click')
      expect(dropdownWrapper.is('[aria-expanded="true"]')).toBe(true)
    })
    test('Not show Block/Mute link in not my profile', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'notMe'),
        },
      })
      const text = wrapper.text()
      expect(text).toContain('Block')
      expect(text).toContain('Mute')
    })
    test('Show Block/Mute link in myself profile', () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user'),
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
          initialProfile: fixtures('user', 'notMe'),
        },
      })
      expect(wrapper.find('[data-test-send-message]').exists()).toBe(true)
    })
    test('Hidden the button when logged out or block or myself', () => {
      const selector = '[data-test-send-message]'
      const myselfWrapper = shallowMount(Profile, opts)
      expect(myselfWrapper.find(selector).exists()).toBe(false)
      const blockedWrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'notMe', 'blocked'),
        },
      })
      expect(blockedWrapper.find(selector).exists()).toBe(false)
      const loggedoutWrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user'),
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
            path: '/messages/:channel',
            name: 'messages-channel',
          },
        ],
      })
      const wrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'notMe'),
        },
        router,
        localVue,
      })
      wrapper.find('[data-test-send-message]').trigger('click')
      await sleep(0)

      expect(wrapper.vm.$route.fullPath).toBe('/messages/1')
    })
    test('Show modal when pm not exist', async () => {
      const wrapper = mount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user', 'carol'),
        },
      })
      const fn = jest.fn()
      wrapper.vm.$modal.show = fn
      wrapper.find('[data-test-send-message]').trigger('click')
      await sleep(0)
      expect(fn).toHaveBeenCalled()
    })
  })
  describe('logged out', () => {
    test('Follow button is hidden', () => {
      const wrapper = shallowMount(Profile, {
        ...opts,
        propsData: {
          ...opts.propsData,
          initialProfile: fixtures('user'),
        },
        mocks: {
          $store: createStore(),
        },
      })
      expect(wrapper.contains('follow-button-stub')).toBe(false)
    })
  })
})
