import { mount, fixtures, baseMountOpts, shallowMount } from 'helper'
import EntityText from '~/components/EntityText'

// TODO: write tests
describe('EntityText component', () => {
  it('Replace patter links with own domain', () => {
    const wrapper = mount(
      EntityText,
      baseMountOpts({
        propsData: {
          content: fixtures('post', 'hasPatterLink').content
        }
      })
    )
    expect(wrapper.text().includes('https://beta.pnut.io/messages/0')).toBe(
      true
    )
  })
  describe('has long post', () => {
    let wrapper
    beforeEach(() => {
      wrapper = mount(
        EntityText,
        baseMountOpts({
          propsData: {
            // FIXME: longpost does not entitytext domain
            content: fixtures('post').content,
            longpost: fixtures('post', 'hasLongpost')
          }
        })
      )
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
  // https://github.com/sunya9/beta/issues/221
  test('Markdown links are displayed correctly', () => {
    const wrapper = mount(
      EntityText,
      baseMountOpts({
        propsData: {
          content: fixtures('post', 'hasMarkdownLink').content
        }
      })
    )
    // hacky: @vue/test-utils does not remove spaces between tags
    // (vue renderer remove all whitespaces between tags default)
    const svelteHtml = wrapper.html().replace(/>\s+</g, '><')
    const wrapper2 = shallowMount({
      render: h =>
        h('div', {
          domProps: {
            innerHTML: svelteHtml
          }
        })
    })
    expect(wrapper2.text()).toContain('Beta [beta.pnut.io]')
  })
})
