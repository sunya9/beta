import Nsfw from '~/components/Nsfw'
import { shallowMount } from 'helper'

describe('NSFW component', () => {
  describe('When post does not include nsfw', () => {
    test('Show contents as it is', () => {
      const wrapper = shallowMount(Nsfw, {
        propsData: {
          includeNsfw: false
        },
        slots: {
          default: 'Not nsfw'
        }
      })
      expect(wrapper.text()).toContain('Not nsfw')
      expect(wrapper.text()).not.toContain('This post includes NSFW')
    })
  })
  describe('When post includes nsfw', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallowMount(Nsfw, {
        propsData: {
          includeNsfw: true
        },
        slots: {
          default: 'nsfw contents'
        }
      })
    })
    test('Hide contents', () => {
      expect(wrapper.text()).not.toContain('nsfw contents')
      expect(wrapper.text()).toContain('This post includes NSFW')
    })
    test('Show contents when clicked button', () => {
      wrapper.find('button').trigger('click')
      expect(wrapper.text()).toContain('nsfw contents')
      expect(wrapper.text()).not.toContain('This post includes NSFW')
    })
  })
})
