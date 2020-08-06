import { mount } from '@vue/test-utils'
import ToggleLongpost from '~/components/atoms/ToggleLongpost.vue'

describe('ToggleLongpost', () => {
  test('render without crash', () => {
    const wrapper = mount(ToggleLongpost, {
      propsData: {
        value: null,
      },
    })
    expect(wrapper.text()).toContain('Long')
    expect(wrapper.find('svg').attributes('data-icon')).toBe('plus')
  })
  test('toggle value', async () => {
    const input = jest.fn()
    const wrapper = mount(ToggleLongpost, {
      propsData: {
        value: null,
      },
      listeners: {
        input,
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('input')?.[0][0].body).toBe('')
    expect(wrapper.emitted('input')?.[0][0].tstamp).toEqual(
      expect.stringMatching(/\d+/)
    )
    expect(input).toBeCalledTimes(1)
    await wrapper.setProps({
      value: {
        body: '',
        tstamp: Date.now().toString(),
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
