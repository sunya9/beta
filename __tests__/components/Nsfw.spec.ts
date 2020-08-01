import { Wrapper } from '@vue/test-utils'
import { shallowMount } from '../helper'
import Nsfw from '~/components/organisms/Nsfw.vue'

describe('NSFW component', () => {
  describe('When post does not include nsfw', () => {
    test('Show contents as it is', () => {
      const wrapper = shallowMount(Nsfw, {
        propsData: {
          includeNsfw: false,
        },
        slots: {
          default: 'Not nsfw',
        },
      })
      expect(wrapper.text()).toContain('Not nsfw')
      expect(wrapper.text()).not.toContain('This post includes NSFW')
    })
  })
  describe('When post includes nsfw', () => {
    let wrapper: Wrapper<Vue>
    beforeEach(() => {
      wrapper = shallowMount(Nsfw, {
        propsData: {
          includeNsfw: true,
        },
        slots: {
          default: 'nsfw contents',
        },
      })
    })
    test('Hide contents', () => {
      expect(wrapper.text()).not.toContain('nsfw contents')
      expect(wrapper.text()).toContain('This post includes NSFW')
    })
    test('Show contents when clicked button', async () => {
      wrapper.find('button').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('nsfw contents')
      expect(wrapper.text()).not.toContain('This post includes NSFW')
    })
  })
})
