import { mount } from '@vue/test-utils'
import TogglePoll from '~/components/atoms/TogglePoll.vue'

describe('TogglePoll', () => {
  test('render', () => {
    const wrapper = mount(TogglePoll)
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.find('svg').attributes('data-icon')).toBe('chart-bar')
  })

  test('toggle state', async () => {
    const wrapper = mount(TogglePoll, {
      propsData: {
        value: null,
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('input')?.[0][0]).toStrictEqual({
      prompt: '',
      type: 'net.unsweets.beta',
      options: [],
      duration: 1440,
    })

    await wrapper.setProps({
      value: {
        prompt: '',
        type: 'net.unsweets.beta',
        options: [],
        duration: 1440,
      },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('input')?.[1][0]).toBeNull()
  })
})
