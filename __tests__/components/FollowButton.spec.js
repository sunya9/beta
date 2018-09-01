import FollowButton from '~/components/FollowButton'
import { mount } from 'helper'

describe('FollowButton component', () => {
  let wrapper
  const baseProfile = {
    you_follow: false,
    id: 1,
    you_blocked: false
  }

  describe('not follow', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile
          }
        }
      })
    })
    test('Text is "Follow"', () => {
      expect(wrapper.text()).toBe('Follow')
    })
    test('To be "following" when succeed in follow', () => {
      wrapper.trigger('click')
      expect(wrapper.text()).toBe('Following')
    })
  })
  describe('following', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_follow: true
          }
        }
      })
    })
    test('Text is "Following"', () => {
      expect(wrapper.text()).toBe('Following')
    })
    test('To be "Follow" when succeed in unfollow', () => {
      wrapper.trigger('click')
      expect(wrapper.text()).toBe('Follow')
    })
  })
  describe('Blocked an user', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_blocked: true
          }
        }
      })
    })
    test('Text is "Unblock"', () => {
      expect(wrapper.text()).toBe('Unblock')
    })
    test('Text is "Follow" when unblock', () => {
      wrapper.trigger('click')
      expect(wrapper.text()).toBe('Follow')
    })
  })
})
