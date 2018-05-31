import User from '~/components/User'
import { shallowMount, createStore } from 'helpers/client'

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
  let store
  beforeEach(() => {
    store = createStore()
  })
  it('data prop equals user property', () => {
    const data = extendData({
      foo: 'bar'
    })
    const { vm } = shallowMount(User, {
      store,
      propsData: {
        data
      }
    })
    expect(vm.$props.data).to.equal(vm.user)
  })
  describe('relation', () => {
    it('text is "Follows you" when follows you', () => {
      const data = extendData({
        follows_you: true
      })
      const { vm } = shallowMount(User, {
        store,
        propsData: {
          data
        }
      })
      expect(vm.relation).to.equal('Follows you')
    })
    it('text is empty when follows you', () => {
      const data = extendData({
        follows_you: false
      })
      const { vm } = shallowMount(User, {
        store,
        propsData: {
          data
        }
      })
      expect(vm.relation).to.equal('')
    })
  })
})
