import { mount } from '@vue/test-utils'
import ToggleNsfw from '~/components/atoms/ToggleNsfw.vue'
import ToggleButton from '~/components/atoms/ToggleButton.vue'

describe('ToggleNSFW', () => {
  test('render without crash', () => {
    const wrapper = mount(ToggleNsfw, {
      propsData: {
        value: false,
      },
    })
    expect(wrapper.text()).toContain('NSFW')
  })
  test('toggle value', async () => {
    const input = jest.fn()
    const wrapper = mount(ToggleNsfw, {
      propsData: {
        value: false,
      },
      listeners: {
        input,
      },
    })
    const toggleButtonWrapper = wrapper.findComponent(ToggleButton)
    expect(wrapper.classes()).toContain('text-dark')
    expect(wrapper.classes()).not.toContain('btn-primary')
    await wrapper.trigger('click')
    expect(toggleButtonWrapper.emitted('input')?.[0][0]).toBe(true)
    expect(input).toBeCalledTimes(1)
    await wrapper.setProps({
      value: true,
    })
    expect(wrapper.classes()).not.toContain('text-dark')
    expect(wrapper.classes()).toContain('btn-primary')
    await wrapper.trigger('click')
    expect(toggleButtonWrapper.emitted('input')?.[1][0]).toBe(false)
    expect(input).toBeCalledTimes(2)
    await wrapper.setProps({
      value: false,
    })
    expect(wrapper.classes()).not.toContain('btn-primary')
    expect(wrapper.classes()).toContain('text-dark')
  })
})
