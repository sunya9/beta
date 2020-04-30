import {
  fixtures,
  shallowMount,
  baseMountOpts,
  authedUserCreateStore,
  authedAccessor,
} from '../helper'
import User from '~/components/User.vue'

describe('User', () => {
  describe('relation', () => {
    test('text is "Follows you" when follows you', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            user: fixtures('user', 'followsYou'),
          },
          mocks: {
            $store: authedUserCreateStore(),
            $accessor: authedAccessor(),
          },
        })
      )
      expect(wrapper.find('[data-test-id="relation"]').text()).toBe(
        'Follows you'
      )
    })
    test('Hidden when follows you', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            user: fixtures('user', 'notMe'),
          },
          mocks: {
            $store: authedUserCreateStore(),
            $accessor: authedAccessor(),
          },
        })
      )
      expect(wrapper.contains('[data-test-id="relation"]')).toBe(false)
    })
    test('Hidden when myself', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            user: fixtures('user'),
          },
          mocks: {
            $store: authedUserCreateStore(),
            $accessor: authedAccessor(),
          },
        })
      )
      expect(wrapper.contains('[data-test-id="relation"]')).toBe(false)
    })
  })
  describe('Follow button', () => {
    test('Hidden when myself', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            user: fixtures('user'),
          },
          mocks: {
            $store: authedUserCreateStore(),
            $accessor: authedAccessor(),
          },
        })
      )
      expect(wrapper.contains('[data-test-id="follow-button"]')).toBe(false)
    })
    test('Show when others', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            user: fixtures('user', 'notMe'),
          },
          mocks: {
            $store: authedUserCreateStore(),
          },
        })
      )
      expect(wrapper.contains('[data-test-id="follow-button"]')).toBe(true)
    })
  })
})
