import { shallowMount } from '@vue/test-utils'
import ActionButton from '~/components/ActionButton'

describe('ActionButton', () => {
  describe('icon props', () => {
    test('pass string', () => {
      const wrapper = shallowMount(ActionButton, {
        propsData: {
          icon: 'foo'
        }
      })
      expect(wrapper.contains('.foo')).toBe(true)
    })
    test('pass array', () => {
      const wrapper = shallowMount(ActionButton, {
        propsData: {
          icon: ['foo', 'bar']
        }
      })
      expect(wrapper.contains('.foo')).toBe(true)
      expect(wrapper.contains('.bar')).toBe(false)
      wrapper.setProps({
        checked: true
      })
      expect(wrapper.contains('.foo')).toBe(false)
      expect(wrapper.contains('.bar')).toBe(true)
    })
  })
})
