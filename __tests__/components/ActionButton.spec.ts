import { mount } from '@vue/test-utils'
import ActionButton from '~/components/ActionButton.vue'

describe('ActionButton', () => {
  describe('icon props', () => {
    test('pass string', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          icon: 'user',
          checked: false,
        },
      })
      expect(wrapper.contains('.fa-user')).toBe(true)
    })
    test('pass array', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          icon: ['user', 'users'],
          checked: false,
        },
      })
      expect(wrapper.contains('.fa-user')).toBe(true)
      expect(wrapper.contains('.fa-users')).toBe(false)
      const wrapper2 = mount(ActionButton, {
        propsData: {
          icon: ['user', 'users'],
          checked: true,
        },
      })
      expect(wrapper2.contains('.fa-user')).toBe(false)
      expect(wrapper2.contains('.fa-users')).toBe(true)
    })
  })
})
