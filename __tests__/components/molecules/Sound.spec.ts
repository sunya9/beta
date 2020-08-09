import { mount } from '@vue/test-utils'
import Sound from '~/components/molecules/Sound.vue'
describe('Sound component', () => {
  test('render correctly', () => {
    const wrapper = mount(Sound, {
      propsData: {
        title: 'title',
        removeable: true,
      },
    })
    expect(wrapper.vm).toBeTruthy()
    expect(wrapper.text()).toContain('title')
    expect(wrapper.find('svg').attributes('data-icon')).toBe('times')
  })

  test('receive remove event when click button', async () => {
    const wrapper = mount(Sound, {
      propsData: {
        removable: true,
      },
    })
    await wrapper.find('a').trigger('click')
    expect(wrapper.emitted('remove')?.[0]).toStrictEqual([])
  })
})
