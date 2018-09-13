import {
  mount,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  fixtures
} from 'helper'
import Profile from '~/components/Profile'

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
        NuxtLink
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
})
