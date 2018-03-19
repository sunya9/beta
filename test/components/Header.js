import Header from '~/components/Header'
import { mount, createStore, router } from 'helpers/client'

describe('Header component', () => {
  let store
  const user = { username: 'foo', id: 1 }
  beforeEach(() => {
    store = createStore()
  })
  it('Hide user menu when not logged in', () => {
    const wrapper = mount(Header, { store, router })
    expect(wrapper.contains('#user-menu')).is.false
  })
  it('Show user menu when logged in', () => {
    store.commit('SET_USER', user)
    const wrapper = mount(Header, { store, router })
    expect(wrapper.contains('#user-menu')).is.true
  })

  it('Hide files link when not logged in', () => {
    const wrapper = mount(Header, { store, router })
    expect(wrapper.contains('#nav-files')).is.false
  })

  it('Show files link when logged in', () => {
    store.commit('SET_USER', user)
    const wrapper = mount(Header, { store, router })
    expect(wrapper.contains('#nav-files')).is.true
  })

  it('Hide messages link when not logged in', () => {
    const wrapper = mount(Header, { store, router })
    expect(wrapper.contains('#nav-messages')).is.false
  })

  it('Show messages link when logged in', async () => {
    store.commit('SET_USER', user)
    const wrapper = mount(Header, { store, router })
    expect(wrapper.contains('#nav-messages')).is.true
  })
})
