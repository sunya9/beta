import Header from '~components/Header'
import createStore from '../../store'
import { getVm } from '../helpers'
import { expect } from 'chai'

describe('Header component', () => {
  const store = createStore()
  const vm = getVm(Header, {
    store
  })
  it('collapseHeight has height more than 0 when mounted', () => {
    expect(vm.collapseHeight).to.equal('calc(100vh - 0px)')
  })

  it('Hide user menu when not logged in', () => {
    const el = vm.$el.querySelector('.nav-item.dropdown')
    expect(el).is.null
  })
  it('Show user menu when logged in', done => {
    store.commit('SET_USER', {
      username: 'foo',
      id: 1
    })
    vm.$nextTick(() => {
      const el = vm.$el.querySelector('.nav-item.dropdown')
      expect(el).is.not.null
      done()
    })
  })
})
