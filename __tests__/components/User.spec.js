import User from '~/components/User'
import {
  fixtures,
  shallowMount,
  baseMountOpts,
  authedUserCreateStore
} from 'helper'

describe('User', () => {
  test('data prop equals user property', () => {
    const { vm } = shallowMount(
      User,
      baseMountOpts({
        propsData: {
          data: fixtures('user')
        },
        mocks: {
          $store: authedUserCreateStore()
        }
      })
    )
    expect(vm.$props.data).toBe(vm.user)
  })
  describe('relation', () => {
    test('text is "Follows you" when follows you', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            data: fixtures('user', 'followsYou')
          },
          mocks: {
            $store: authedUserCreateStore()
          }
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
            data: fixtures('user', 'notMe')
          },
          mocks: {
            $store: authedUserCreateStore()
          }
        })
      )
      expect(wrapper.find('[data-test-id="relation"]').text()).toBe('')
    })
    test('Hidden when myself', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            data: fixtures('user')
          },
          mocks: {
            $store: authedUserCreateStore()
          }
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
            data: fixtures('user')
          },
          mocks: {
            $store: authedUserCreateStore()
          }
        })
      )
      expect(wrapper.contains('[data-test-id="follow-button"]')).toBe(false)
    })
    test('Show when others', () => {
      const wrapper = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            data: fixtures('user', 'notMe')
          },
          mocks: {
            $store: authedUserCreateStore()
          }
        })
      )
      expect(wrapper.contains('[data-test-id="follow-button"]')).toBe(true)
    })
  })
})
