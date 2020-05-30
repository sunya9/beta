import { mount } from '@vue/test-utils'
import ActionButton from '~/components/atoms/ActionButton.vue'

describe('ActionButton', () => {
  describe('icon props', () => {
    test('pass string', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          icon: 'user',
          checked: false,
        },
      })
      expect(wrapper.find('.fa-user').exists()).toBe(true)
    })
    test('pass array', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          icon: ['user', 'users'],
          checked: false,
        },
      })
      expect(wrapper.find('.fa-user').exists()).toBe(true)
      expect(wrapper.find('.fa-users').exists()).toBe(false)
      const wrapper2 = mount(ActionButton, {
        propsData: {
          icon: ['user', 'users'],
          checked: true,
        },
      })
      expect(wrapper2.find('.fa-user').exists()).toBe(false)
      expect(wrapper2.find('.fa-users').exists()).toBe(true)
    })
  })
})
