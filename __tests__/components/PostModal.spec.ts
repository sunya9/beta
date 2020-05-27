import { Wrapper } from '@vue/test-utils'
import {
  mount,
  authedUserCreateStore,
  RouterLinkStub as NuxtLink,
  fixtures,
  authedAccessor,
} from '../helper'
import PostModal from '~/components/PostModal.vue'
import { Post } from '~/models/post'

type PostModalType = InstanceType<typeof PostModal> & {
  show: (post: Post) => void
}

describe('PostModal component', () => {
  let wrapper: Wrapper<PostModalType>
  beforeEach(() => {
    wrapper = mount(PostModal, {
      mocks: {
        $store: authedUserCreateStore(),
        $accessor: authedAccessor(),
      },
      stubs: {
        Compose: true,
        NuxtLink,
        post: true,
      },
    }) as Wrapper<PostModalType>
  })
  test('show post when receive post argument', async () => {
    wrapper.vm.show(fixtures('post'))
    await wrapper.vm.$nextTick()
    expect(wrapper.find('post-stub').exists()).toBe(true)
  })
})
