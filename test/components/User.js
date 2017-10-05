import User from '~/components/User'
import {
  shallow
} from 'helpers/client'

function extendData(obj) {
  const baseData = {
    content: {
      avatar_image: {
        link: 'image_url'
      },
      html: 'hello'
    },
    name: 'foo',
    username: 'bar'
  }
  return Object.assign({}, baseData, obj)
}

describe('User', () => {
  it('data prop equals user property', () => {
    const data = extendData({
      foo: 'bar'
    })
    const {
      vm
    } = shallow(User, {
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
      const {
        vm
      } = shallow(User, {
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
      const {
        vm
      } = shallow(User, {
        propsData: {
          data
        }
      })
      expect(vm.relation).to.equal('')
    })
  })
})
