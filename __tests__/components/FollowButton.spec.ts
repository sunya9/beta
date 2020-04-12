import { Wrapper } from '@vue/test-utils'
import { mount } from '../helper'
import FollowButton from '~/components/FollowButton.vue'

type FollowButtonType = typeof FollowButton & Vue

describe('FollowButton component', () => {
  let wrapper: Wrapper<FollowButtonType>
  const baseProfile = {
    you_follow: false,
    id: 1,
    you_blocked: false,
  }

  describe('not follow', () => {
    beforeEach(() => {
      wrapper = mount<FollowButtonType>(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
          },
        },
      })
    })
    test('Text is "Follow"', () => {
      expect(wrapper.text()).toBe('Follow')
    })
    test('To be "following" when succeed in follow', async () => {
      wrapper.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBe('Following')
    })
  })
  describe('following', () => {
    beforeEach(() => {
      wrapper = mount<FollowButtonType>(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_follow: true,
          },
        },
      })
    })
    test('Text is "Following"', () => {
      expect(wrapper.text()).toBe('Following')
    })
    test('To be "Follow" when succeed in unfollow', async () => {
      wrapper.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBe('Follow')
    })
  })
  describe('Blocked an user', () => {
    beforeEach(() => {
      wrapper = mount<FollowButtonType>(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_blocked: true,
          },
        },
      })
    })
    test('Text is "Unblock"', () => {
      expect(wrapper.text()).toBe('Unblock')
    })
    test('Text is "Follow" when unblock', async () => {
      wrapper.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toBe('Follow')
    })
  })
})
