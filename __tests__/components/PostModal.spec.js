import PostModal from '~/components/PostModal'
import {
  mount,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink
} from 'helper'

const post = {
  content: {
    entities: {
      links: [],
      tags: [],
      mentions: []
    },
    text: 'foo'
  },
  user: {
    id: 123,
    username: 'bar',
    content: {
      avatar_image: ''
    }
  },
  counts: {}
}
describe('PostModal component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(PostModal, {
      mocks: {
        $store: authedUserCreateStore()
      },
      stubs: {
        Compose: true,
        NuxtLink
      }
    })
  })
  test('show post when receive post argument', async () => {
    wrapper.vm.show(post)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.post').text()).toContain('foo')
  })
})
