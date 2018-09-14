import { mount } from 'helper'
import CustomCheckbox from '~/components/CustomCheckbox'

describe('CustomCheckbox component', () => {
  describe('props', () => {
    test('Disabled checkbox when pass disabled', () => {
      const wrapper = mount(CustomCheckbox, {
        propsData: {
          disabled: true
        }
      })
      expect(wrapper.find('input').element.disabled).toBe(true)
    })
    test('checked when pass checked = `true`', () => {
      const wrapper = mount(CustomCheckbox, {
        propsData: {
          checked: true
        }
      })
      expect(wrapper.find('input').element.checked).toBe(true)
    })
  })
  test('toggle checkbox when clicked', async () => {
    const wrapper = mount(CustomCheckbox, {
      propsData: {
        checked: false
      }
    })
    const $input = wrapper.find('input')
    expect($input.element.checked).toBe(false)
    $input.trigger('click')
    expect($input.element.checked).toBe(true)
    $input.trigger('click')
    expect($input.element.checked).toBe(false)
  })
})
