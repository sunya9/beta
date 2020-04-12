import { Wrapper } from '@vue/test-utils'
import {
  mount,
  authedUserCreateStore,
  baseMountOpts,
  fixtures,
} from '../helper'
import Post from '~/components/Post.vue'

describe('Post component', () => {
  let wrapper: Wrapper<Post>
  beforeEach(() => {
    wrapper = mount(
      Post,
      baseMountOpts({
        mocks: {
          $store: authedUserCreateStore(),
        },
        propsData: {
          post: fixtures('post'),
        },
      })
    )
  })
  describe('a post deleted', () => {
    test('Show [Post deleted]', async () => {
      wrapper.setProps({
        post: fixtures('post', 'deleted'),
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('[Post deleted]')
    })
  })
  describe('has long post', () => {
    beforeEach(() => {
      wrapper.setProps({
        post: fixtures('post', 'hasLongpost'),
      })
    })
    it('Show Expand/Collapse button', async () => {
      const collapseText = 'Collapse Post'
      const expandText = 'Expand Post'
      expect(wrapper.text()).toContain(expandText)
      expect(wrapper.text()).not.toContain(collapseText)
      wrapper.find('button[data-test-collapse-button]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toContain(expandText)
      expect(wrapper.text()).toContain(collapseText)
    })
    it('Show longpost content', async () => {
      wrapper.find('button[data-test-collapse-button]').trigger('click')
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('title')
      expect(wrapper.text()).toContain('body')
    })
  })
})
