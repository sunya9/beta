import Vue from 'vue'
import { Wrapper } from '@vue/test-utils'
import { mount, authedAccessor } from '../helper'
import FollowButton from '~/components/atoms/FollowButton.vue'
import { User } from '~/entity/user'

describe('FollowButton component', () => {
  let wrapper: Wrapper<Vue>
  const baseProfile = {
    you_follow: false,
    id: '2',
    you_blocked: false,
  }

  describe('not follow', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
          },
        },
        mocks: {
          $accessor: authedAccessor(),
        },
      })
    })
    test('Text is "Follow"', () => {
      expect(wrapper.text()).toBe('Follow')
    })
    test('To be "following" when succeed in follow', async () => {
      await wrapper.trigger('click')
      expect(wrapper.emitted('update:profile')?.[0][0].you_follow).toBe(true)
    })
  })
  describe('following', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_follow: true,
          },
        },
        mocks: {
          $accessor: authedAccessor(),
        },
      })
    })
    test('Text is "Following"', () => {
      expect(wrapper.text()).toBe('Following')
    })
    test('To be "Follow" when succeed in unfollow', async () => {
      wrapper.trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.emitted('update:profile')?.[0][0].you_follow).toBe(false)
    })
  })
  describe('Blocked an user', () => {
    beforeEach(() => {
      wrapper = mount(FollowButton, {
        propsData: {
          profile: {
            ...baseProfile,
            you_blocked: true,
          },
        },
        mocks: {
          $accessor: authedAccessor(),
        },
      })
    })
    test('Text is "Unblock"', () => {
      expect(wrapper.text()).toBe('Unblock')
    })
    test('Text is "Follow" when unblock', async () => {
      await wrapper.trigger('click')
      const user: User = wrapper.emitted('update:profile')?.[0][0]
      expect(user.you_follow).toBe(false)
      expect(user.you_blocked).toBe(false)
    })
  })
})
