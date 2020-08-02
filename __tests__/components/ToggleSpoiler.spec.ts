import { mount } from '@vue/test-utils'
import ToggleSpoiler from '~/components/atoms/ToggleSpoiler.vue'

describe('ToggleSpoiler', () => {
  test('render without crash', () => {
    const wrapper = mount(ToggleSpoiler, {
      propsData: {
        value: null,
      },
    })
    expect(wrapper.text()).toContain('Spoiler')
    expect(wrapper.find('svg').attributes('data-icon')).toBe('bell')
  })
  test('toggle value', async () => {
    const input = jest.fn()
    const wrapper = mount(ToggleSpoiler, {
      propsData: {
        value: null,
      },
      listeners: {
        input,
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('input')?.[0][0]).toStrictEqual({
      topic: '',
    })
    expect(input).toBeCalledTimes(1)
    await wrapper.setProps({
      value: {
        topic: '',
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('input')?.[1][0]).toBe(null)
    expect(input).toBeCalledTimes(2)
    await wrapper.setProps({
      value: null,
    })
  })
})
