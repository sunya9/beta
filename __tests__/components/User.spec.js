import User from '~/components/User'
import { shallowMount, baseMountOpts } from 'helper'

function extendData(obj) {
  const baseData = {
    content: {
      avatar_image: {
        link: 'image_url'
      },
      html: '<span>Hello</span>'
    },
    name: 'foo',
    username: 'bar',
    you_follow: false,
    id: 1
  }
  return Object.assign({}, baseData, obj)
}

describe('User', () => {
  test('data prop equals user property', () => {
    const data = extendData({
      foo: 'bar'
    })
    const { vm } = shallowMount(
      User,
      baseMountOpts({
        propsData: {
          data
        }
      })
    )
    expect(vm.$props.data).toBe(vm.user)
  })
  describe('relation', () => {
    test('text is "Follows you" when follows you', () => {
      const data = extendData({
        follows_you: true
      })
      const { vm } = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            data
          }
        })
      )
      expect(vm.relation).toBe('Follows you')
    })
    test('text is empty when follows you', () => {
      const data = extendData({
        follows_you: false
      })
      const { vm } = shallowMount(
        User,
        baseMountOpts({
          propsData: {
            data
          }
        })
      )
      expect(vm.relation).toBe('')
    })
  })
})
