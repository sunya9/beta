import { shallowMount } from '@vue/test-utils'
import Avatar from '~/components/Avatar.vue'

describe('Avatar', () => {
  let opts: {
    propsData: {
      avatar:
        | string
        | {
            link: string
          }
      size?: number
      enablePlaceholder?: boolean
      maxSize?: number | string
    }
  }
  beforeEach(() => {
    opts = {
      propsData: {
        avatar: 'foo.png',
      },
    }
  })
  describe('avatar props', () => {
    test('pass string', () => {
      const wrapper = shallowMount(Avatar, opts)
      expect(wrapper.contains('img[src="foo.png"]')).toBe(true)
    })
    test('pass object', () => {
      opts.propsData.avatar = {
        link: 'foo.png',
      }
      const wrapper = shallowMount(Avatar, opts)
      expect(wrapper.contains('img[src="foo.png"]')).toBe(true)
    })
    test('When pass the username, show icon using API', () => {
      const wrapper = shallowMount(Avatar, {
        propsData: {
          avatar: '@test_user',
        },
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
    opts.propsData.maxSize = '24'
    const wrapper2 = shallowMount(Avatar, opts)
    expect(wrapper2.find('img').attributes().src).toContain('?w=24')
  })
  test('size attr equals width and height', async () => {
    opts.propsData.size = 32
    const wrapper = shallowMount(Avatar, opts)
    expect(wrapper.attributes().width).toBe('32')
    expect(wrapper.attributes().height).toBe('32')
    wrapper.setProps({
      size: 64,
    })
    await wrapper.vm.$nextTick()
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
  test('set srcset', () => {
    opts.propsData.size = 32
    const wrapper = shallowMount(Avatar, opts)
    expect(wrapper.attributes().srcset).toBe('foo.png?w=64 2x')
  })
  test('Show placeholder svg when avatar link is empty', () => {
    opts.propsData.avatar = {
      link: '',
    }
    const wrapper = shallowMount(Avatar, opts)
    expect(wrapper.find('img').attributes().src).toContain('')
  })
  test('Show placeholder svg when enablePlaceholder prop is true', () => {
    opts.propsData.enablePlaceholder = true
    const wrapper = shallowMount(Avatar, opts)
    expect(wrapper.find('img').attributes().src).toContain('')
  })
})
