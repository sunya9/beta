import Header from '~/components/Header'
import {
  shallow,
  createStore
} from 'helpers/client'

describe('Header component', () => {
  let store
  beforeEach(() => {
    store = createStore()
  })
  it('collapseHeight has height more than 0 when mounted', () => {
    const {
      vm
    } = shallow(Header, {
      store
    })
    expect(vm.collapseHeight).to.equal('calc(100vh - 0px)')
  })

  it('Hide user menu when not logged in', () => {
    const {
      vm
    } = shallow(Header, {
      store
    })
    vm.$nextTick(() => {
      const el = vm.$el.querySelector('.nav-item.dropdown')
      expect(el).is.null
    })
  })
  it('Show user menu when logged in', done => {
    const {
      vm
    } = shallow(Header, {
      store
    })
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

  it('Hide search form when not logged in', () => {
    const {
      vm
    } = shallow(Header, {
      store
    })

    vm.$nextTick(() => {
      const el = vm.$el.querySelector('#search-form')
      expect(el).is.null
    })
  })

  it('Show search form when not logged in', () => {
    const {
      vm
    } = shallow(Header, {
      store
    })
    store.commit('SET_USER', {
      username: 'foo',
      id: 1
    })
    vm.$nextTick(() => {
      const el = vm.$el.querySelector('#search-form')
      expect(el).is.not.null
    })
  })

  it('Hide files link when not logged in', () => {
    const {
      vm
    } = shallow(Header, {
      store
    })

    vm.$nextTick(() => {
      const el = vm.$el.querySelector('#nav-files')
      expect(el).is.null
    })
  })

  it('Show files link when not logged in', () => {
    const {
      vm
    } = shallow(Header, {
      store
    })
    store.commit('SET_USER', {
      username: 'foo',
      id: 1
    })
    vm.$nextTick(() => {
      const el = vm.$el.querySelector('#nav-files')
      expect(el).is.not.null
    })
  })
})
