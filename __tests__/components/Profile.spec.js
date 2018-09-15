import {
  mount,
  createStore,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  shallowMount,
  fixtures,
  createLocalVue,
  sleep
} from 'helper'
import Profile from '~/components/Profile'
import VueRouter from 'vue-router'
import CreatePmModal from '~/components/CreatePmModal'

describe('Profile component', () => {
  let opts

  beforeEach(() => {
    opts = {
      propsData: {
        initialProfile: fixtures('user')
      },
      mocks: {
        $store: authedUserCreateStore()
      },
      attachToDocument: true,
      stubs: {
        Thumb: true,
        NuxtLink,
        CreatePmModal: CreatePmModal
      }
    }
  })
  describe('Cover', () => {
    test('Show cover image', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.find('img').attributes().src).toContain('cover.png')
    })
  })
  describe('Userinfo', () => {
    test('Show a shield badge when verified domain', async () => {
      opts.propsData.initialProfile = fixtures('user', 'hasVerifiedDomain')
      const wrapper = mount(Profile, opts)
      expect(wrapper.contains('#profile-domain')).toBe(true)
    })
    test('Hidden a shield badge when not verified domain', () => {
      const wrapper = mount(Profile, opts)
      expect(wrapper.contains('#profile-domain')).toBe(false)
    })
    test('Show bio when content.text exists', async () => {
      opts.propsData.initialProfile = fixtures('user', 'hasBio')
      const wrapper = mount(Profile, opts)
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
      const wrapper = mount(Profile, opts)
      expect(wrapper.contains('#profile-follow-button')).toBe(false)
    })
  })
  describe('Everyone except me', () => {
    let wrapper
    beforeEach(() => {
      opts.propsData.initialProfile = fixtures('user', 'notMe')
      wrapper = mount(Profile, opts)
    })
    test('Show follow button', async () => {
      expect(wrapper.contains('#profile-follow-button')).toBe(true)
    })
    test('relation is not shown when another user not follow you', () => {
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('')
    })
    test('relation is shown when another user follows you', async () => {
      opts.propsData.initialProfile = fixtures('user', 'followsYou')
      wrapper = mount(Profile, opts)
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('Follows you')
    })
  })
  describe('more dropdown', () => {
    test('Show dropdown when three dots is clicked', async () => {
      const wrapper = mount(Profile, opts)
      const dropdownBody = wrapper.find('[aria-labelledby="profile-dropdown"]')
      expect(dropdownBody.is('[aria-expanded="false"]')).toBe(true)
      wrapper.find('#profile-dropdown').trigger('click')
      expect(dropdownBody.is('[aria-expanded="true"]')).toBe(true)
    })
    test('Not show Block/Mute link in not my profile', () => {
      opts.propsData.initialProfile = fixtures('user', 'notMe')
      const wrapper = mount(Profile, opts)
      const text = wrapper.text()
      expect(text).toContain('Block')
      expect(text).toContain('Mute')
    })
    test('Show Block/Mute link in myself profile', () => {
      opts.propsData.initialProfile = fixtures('user')
      const wrapper = mount(Profile, opts)
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
      opts.propsData.initialProfile = fixtures('user', 'notMe')
      const wrapper = shallowMount(Profile, opts)
      expect(wrapper.find('[data-test-send-message]').exists()).toBe(true)
    })
    test('Hidden the button when logged out or block or myself', () => {
      const selector = '[data-test-send-message]'
      const myselfWrapper = shallowMount(Profile, opts)
      expect(myselfWrapper.find(selector).exists()).toBe(false)
      opts.propsData.initialProfile = fixtures('user', 'notMe', 'blocked')
      const blockedWrapper = shallowMount(Profile, opts)
      expect(blockedWrapper.find(selector).exists()).toBe(false)
      opts.propsData.initialProfile = fixtures('user')
      opts.mocks.$store = createStore()
      const loggedoutWrapper = shallowMount(Profile, opts)
      expect(loggedoutWrapper.find(selector).exists()).toBe(false)
    })
    test('Transition page when pm exists', async () => {
      const localVue = new createLocalVue()
      localVue.use(VueRouter)
      const router = new VueRouter({
        routes: [
          {
            path: '/messages/:channel',
            name: 'messages-channel'
          }
        ]
      })
      opts.propsData.initialProfile = fixtures('user', 'notMe')
      opts.router = router
      opts.localVue = localVue
      const wrapper = shallowMount(Profile, opts)
      wrapper.find('[data-test-send-message]').trigger('click')
      await sleep(0)
      expect(wrapper.vm.$route.fullPath).toBe('/messages/1')
    })
    test('Show modal when pm not exist', async () => {
      opts.propsData.initialProfile = fixtures('user', 'carol')
      const wrapper = mount(Profile, opts)
      const fn = jest.fn()
      wrapper.vm.$modal.show = fn
      wrapper.find('[data-test-send-message]').trigger('click')
      await sleep(0)
      expect(fn).toHaveBeenCalled()
    })
  })
})
