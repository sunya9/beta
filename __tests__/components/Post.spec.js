import Post from '~/components/Post'
import EntityText from '~/components/EntityText'
import {
  shallowMount,
  authedUserCreateStore,
  baseMountOpts,
  fixtures
} from 'helper'

describe('Post component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(
      Post,
      baseMountOpts({
        stubs: {
          EntityText
        },
        mocks: {
          $store: authedUserCreateStore()
        },
        propsData: {
          post: fixtures('post')
        }
      })
    )
  })
  describe('a post deleted', () => {
    test('Show [Post deleted]', async () => {
      wrapper.setProps({
        post: fixtures('post', 'deleted')
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('[Post deleted]')
    })
  })
})
