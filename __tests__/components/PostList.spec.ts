import {
  mount,
  fixtures,
  baseMountOpts,
  authedUserCreateStore,
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
          },
        })
      )
    })
    test('highlight the target post when the main post has reply_to', () => {
      expect(wrapper.contains('.list-group-item-warning')).toBe(true)
    })
    test('main post has vertical margin', () => {
      expect(wrapper.contains('.list-group-item.my-4')).toBe(true)
    })
  })
})
