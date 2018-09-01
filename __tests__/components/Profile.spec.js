import {
  mount,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink
} from 'helper'
import Profile from '~/components/Profile'

function baseProfile(...obj) {
  return Object.assign(
    {
      id: 1,
      content: {
        cover_image: {
          link: 'https://example.com/cover.png',
          width: 960,
          height: 640
        },
        avatar_image: {
          link: 'https://example.com/avatar.png',
          width: 128,
          height: 128
        }
      },
      counts: {
        posts: 1,
        following: 2,
        followers: 3,
        bookmarks: 4
      },
      follows_you: false
    },
    ...obj
  )
}

describe('Profile component', () => {
  let profile, opts, $store, wrapper, vm

  beforeEach(() => {
    $store = authedUserCreateStore()
    profile = baseProfile()
    opts = {
      propsData: {
        initialProfile: profile
      },
      mocks: {
        $store
      },
      attachToDocument: true,
      stubs: {
        Thumb: true,
        NuxtLink
      }
    }
    wrapper = mount(Profile, opts)
    vm = wrapper.vm
  })
  describe('Cover', () => {
    test('Show cover image', () => {
      expect(wrapper.find('img').attributes().src).toContain('cover.png')
    })
  })
  describe('Userinfo', () => {
    test('Show a shield badge when verified domain', async () => {
      wrapper.vm.$set(wrapper.vm.profile, 'verified', {
        domain: 'example.com',
        link: 'https://example.com'
      })
      expect(wrapper.contains('#profile-domain')).toBe(true)
    })
    test('Hidden a shield badge when not verified domain', () => {
      expect(wrapper.contains('#profile-domain')).toBe(false)
    })
    test('Show bio when content.text exists', async () => {
      vm.$set(vm.profile.content, 'text', 'foo')
      expect(wrapper.contains('.description')).toBe(true)
    })
    test('Hidden bio when profile.text does not exist', () => {
      wrapper.setProps({
        initialProfile: baseProfile()
      })
      expect(wrapper.contains('.description')).toBe(false)
    })
  })
  describe('counts', () => {
    let text
    beforeEach(() => {
      text = wrapper.find('#profile-counts').text()
    })
    test('Posts', () => expect(text).toContain('1 Posts'))
    test('Follows', () => expect(text).toContain('2 Follows'))
    test('Followers', () => expect(text).toContain('3 Followers'))
    test('Stars', () => expect(text).toContain('4 Starred'))
  })
  describe('Me', () => {
    test('Not shown follow button', () => {
      expect(wrapper.contains('#profile-follow-button')).toBe(false)
    })
  })
  describe('Everyone except me', () => {
    const others = baseProfile({
      id: 2,
      follows_you: false
    })
    beforeEach(() => {
      vm.profile = others
    })
    test('Show follow button', async () => {
      expect(wrapper.contains('#profile-follow-button')).toBe(true)
    })
    test('relation is not shown when another user not follow you', () => {
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('')
    })
    test('relation is shown when another user follows you', async () => {
      vm.profile.follows_you = true
      const $relation = wrapper.find('#profile-relation')
      expect($relation.text().trim()).toBe('Follows you')
    })
  })
})
