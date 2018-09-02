import { shallowMount } from '@vue/test-utils'
import ActionButton from '~/components/ActionButton'

describe('ActionButton', () => {
  describe('icon props', () => {
    test('pass string', () => {
      const wrapper = shallowMount(ActionButton, {
        propsData: {
          icon: 'user'
        }
      })
      expect(wrapper.contains('.fa-user')).toBe(true)
    })
    test('pass array', () => {
      const wrapper = shallowMount(ActionButton, {
        propsData: {
          icon: ['user', 'users']
        }
      })
      expect(wrapper.contains('.fa-user')).toBe(true)
      expect(wrapper.contains('.fa-users')).toBe(false)
      wrapper.setProps({
        checked: true
      })
      expect(wrapper.contains('.fa-user')).toBe(false)
      expect(wrapper.contains('.fa-users')).toBe(true)
    })
  })
})
