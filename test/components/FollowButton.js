import Header from '~/components/FollowButton'
import { mount } from 'helpers/client'

describe('FollowButton component', () => {
  describe('initialState is false', () => {
    const { vm } = mount(Header, {
      propsData: {
        initialState: false,
        userId: 1
      }
    })
    it('Text is "Follow"', () => {
      expect(vm.text).to.equal('Follow')
    })
    it('To be true when succeed in follow', done => {
      vm
        .follow()
        .then(() => {
          expect(vm.state).to.be.true
          done()
        })
        .catch(done)
    })
  })
  describe('initialState is true', () => {
    const { vm } = mount(Header, {
      propsData: {
        initialState: true,
        userId: 1
      }
    })
    it('Text is "Following"', () => {
      expect(vm.text).to.equal('Following')
    })
    it('To be false when succeed in unfollow', done => {
      vm
        .follow()
        .then(() => {
          expect(vm.state).to.be.false
          done()
        })
        .catch(done)
    })
  })
})
