import { shallowMount } from '@vue/test-utils'
import Avatar from '~/components/Avatar'

describe('Avatar', () => {
  let opts
  beforeEach(() => {
    opts = {
      propsData: {
        avatar: 'foo.png'
      }
    }
  })
  describe('avatar props', () => {
    test('pass string', () => {
      const wrapper = shallowMount(Avatar, opts)
      expect(wrapper.contains('img[src="foo.png"]')).toBe(true)
    })
    test('pass object', () => {
      opts.propsData.avatar = {
        link: 'foo.png'
      }
      const wrapper = shallowMount(Avatar, opts)
      expect(wrapper.contains('img[src="foo.png"]')).toBe(true)
    })
    test('When pass the username, show icon using API', () => {
      const wrapper = shallowMount(Avatar, {
        propsData: {
          avatar: '@test_user'
        }
      })
      expect(wrapper.find('img').attributes().src).toBe(
        'https://api.pnut.io/v0/users/@test_user/avatar'
      )
    })
  })
  test('Add w param when max-size is larger than 0', () => {
    opts.propsData.maxSize = 16
    const wrapper = shallowMount(Avatar, opts)
    expect(wrapper.find('img').attributes().src).toContain('?w=16')
    wrapper.setProps({
      maxSize: '24'
    })
    expect(wrapper.find('img').attributes().src).toContain('?w=24')
  })
  test('size attr equals width and height', () => {
    opts.propsData.size = 32
    const wrapper = shallowMount(Avatar, opts)
    expect(wrapper.attributes().width).toBe('32')
    expect(wrapper.attributes().height).toBe('32')
    wrapper.setProps({
      size: 64
    })
    expect(wrapper.attributes().width).toBe('64')
    expect(wrapper.attributes().height).toBe('64')
  })
  test('Default shape is rounded-circle', () => {
    const wrapper = shallowMount(Avatar, opts)
    expect(wrapper.find('img').classes()).toContain('rounded-circle')
  })
  test('Be square icon when square_avatars equals `true`', async () => {
    localStorage.setItem('square_avatars', 'true')
    const wrapper = shallowMount(Avatar, opts)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('img').classes()).not.toContain('rounded-circle')
  })
})
