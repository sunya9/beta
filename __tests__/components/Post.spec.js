import { mount, authedUserCreateStore, baseMountOpts, fixtures } from 'helper'
import Post from '~/components/Post'
import EntityText from '~/components/EntityText'

describe('Post component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(
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
  describe('has long post', () => {
    beforeEach(() => {
      wrapper.setProps({
        post: fixtures('post', 'hasLongpost')
      })
    })
    it('Show Expand/Collapse button', () => {
      const collapseText = 'Collapse Post'
      const expandText = 'Expand Post'
      expect(wrapper.text()).toContain(expandText)
      expect(wrapper.text()).not.toContain(collapseText)
      wrapper.find('button[data-test-collapse-button]').trigger('click')
      expect(wrapper.text()).not.toContain(expandText)
      expect(wrapper.text()).toContain(collapseText)
    })
    it('Show longpost content', () => {
      wrapper.find('button[data-test-collapse-button]').trigger('click')
      expect(wrapper.text()).toContain('title')
      expect(wrapper.text()).toContain('body')
    })
  })
})
