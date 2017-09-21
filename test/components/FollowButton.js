import Header from '~/components/FollowButton'
import { expect } from 'chai'
import { getVm } from '../client-helpers'

import '../fixtures/axios-mock'

describe('FollowButton component', () => {
  describe('initialState is false', () => {
    const vm = getVm(Header, {propsData: {initialState: false, userId: 1}})
    it('Text is "Follow"', () => {
      expect(vm.text).to.equal('Follow')
    })
    it('To be true when succeed in follow', done => {
      vm.follow().then(res => {
        expect(vm.state).to.be.true
        done()
      }).catch(done)
    })
  })
  describe('initialState is true', () => {
    const vm = getVm(Header, {propsData: {initialState: true, userId: 1}})
    it('Text is "Following"', () => {
      expect(vm.text).to.equal('Following')
    })
    it('To be false when succeed in unfollow', done => {
      vm.follow().then(res => {
        expect(vm.state).to.be.false
        done()
      }).catch(done)
    })
  })
})
