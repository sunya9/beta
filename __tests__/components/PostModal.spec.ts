import { Wrapper } from '@vue/test-utils'
import {
  mount,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  fixtures,
} from '../helper'
import PostModal from '~/components/PostModal.vue'
import { Post } from '~/models/post'

type PostModalType = PostModal & { show: (post: Post) => void }
describe('PostModal component', () => {
  let wrapper: Wrapper<PostModalType>
  beforeEach(() => {
    wrapper = mount<PostModalType>(PostModal, {
      mocks: {
        $store: authedUserCreateStore(),
      },
      stubs: {
        Compose: true,
        NuxtLink,
        post: true,
      },
    })
  })
  test('show post when receive post argument', async () => {
    wrapper.vm.show(fixtures('post'))
    await wrapper.vm.$nextTick()
    expect(wrapper.contains('post-stub')).toBe(true)
  })
})
