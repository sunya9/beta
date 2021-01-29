import { mount } from '@vue/test-utils'
import LongPost from '~/components/organisms/LongPost.vue'

const longPost = {
  body: 'body',
  title: 'title',
} as const

describe('LongPost', () => {
  test('render', () => {
    const wrapper = mount(LongPost, {
      propsData: {
        longPost,
      },
    })
    expect(wrapper.html()).toBeTruthy()
  })
  test('toggle visibility', async () => {
    const wrapper = mount(LongPost, {
      propsData: {
        longPost,
      },
    })
    expect(wrapper.text()).not.toContain('body')
    expect(wrapper.text()).not.toContain('title')
    expect(wrapper.text()).toContain('Expand Post')

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).toContain('body')
    expect(wrapper.text()).toContain('title')
    expect(wrapper.text()).toContain('Collapse Post')

    await wrapper.find('button').trigger('click')

    expect(wrapper.text()).not.toContain('body')
    expect(wrapper.text()).not.toContain('title')
    expect(wrapper.text()).toContain('Expand Post')
  })
})
