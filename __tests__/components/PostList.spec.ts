import {
  mount,
  fixtures,
  baseMountOpts,
  authedUserCreateStore,
  authedAccessor,
} from '../helper'
import PostList from '~/components/PostList.vue'

const posts = [fixtures('post'), fixtures('post', 'main', 'replyTo')]

describe('PostList component', () => {
  describe('detail', () => {
    let wrapper: ReturnType<typeof mount>
    beforeEach(() => {
      wrapper = mount(
        PostList,
        baseMountOpts({
          propsData: {
            data: {
              meta: {},
              data: posts,
            },
            main: '2',
          },
          mocks: {
            $store: authedUserCreateStore(),
            $accessor: authedAccessor(),
          },
        })
      )
    })
    test('highlight the target post when the main post has reply_to', () => {
      expect(wrapper.find('.list-group-item-warning').exists()).toBe(true)
    })
    test('main post has vertical margin', () => {
      expect(wrapper.find('.list-group-item.my-4').exists()).toBe(true)
    })
  })
})
