import { mount } from '../helper'
import CustomCheckbox from '~/components/atoms/CustomCheckbox.vue'

describe('CustomCheckbox component', () => {
  describe('props', () => {
    test('Disabled checkbox when pass disabled', () => {
      const wrapper = mount(CustomCheckbox, {
        propsData: {
          disabled: true,
          checked: false,
        },
      })
      expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(
        true
      )
    })
    test('checked when pass checked = `true`', () => {
      const wrapper = mount(CustomCheckbox, {
        propsData: {
          checked: true,
        },
      })
      expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(
        true
      )
    })
  })
  test('toggle checkbox when clicked', async () => {
    const wrapper = mount(CustomCheckbox, {
      propsData: {
        checked: false,
      },
    })
    const $input = wrapper.find('input')
    expect(($input.element as HTMLInputElement).checked).toBe(false)
    $input.trigger('click')
    await wrapper.vm.$nextTick()
    expect(($input.element as HTMLInputElement).checked).toBe(true)
    $input.trigger('click')
    await wrapper.vm.$nextTick()
    expect(($input.element as HTMLInputElement).checked).toBe(false)
  })
})
