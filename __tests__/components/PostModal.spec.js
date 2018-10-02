import PostModal from '~/components/PostModal'
import {
  mount,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  fixtures
} from 'helper'

describe('PostModal component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PostModal, {
      mocks: {
        $store: authedUserCreateStore()
      },
      stubs: {
        Compose: true,
        NuxtLink,
        post: true
      }
    })
  })
  test('show post when receive post argument', async () => {
    wrapper.vm.show(fixtures('post'))
    await wrapper.vm.$nextTick()
    expect(wrapper.contains('post-stub')).toBe(true)
  })
})
