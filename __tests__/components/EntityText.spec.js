import { shallowMount } from 'helper'
import EntityText from '~/components/EntityText'

// TODO: write tests
describe('EntityText component', () => {
  it('Replace patter links with own domain', () => {
    const patterLink = 'https://patter.chat/room/0'
    const wrapper = shallowMount(EntityText, {
      propsData: {
        content: {
          entities: {
            links: [
              {
                text: patterLink,
                len: patterLink.length,
                link: patterLink,
                pos: 0
              }
            ],
            tags: [],
            mentions: []
          },
          text: patterLink
        }
      }
    })
    expect(wrapper.text().includes('https://beta.pnut.io/messages/0')).toBe(
      true
    )
  })
  describe('has long post', () => {
    let wrapper
    const title = 'long post title'
    const body = 'long post body'
    beforeEach(() => {
      wrapper = shallowMount(EntityText, {
        propsData: {
          content: {
            entities: {
              links: [],
              tags: [],
              mentions: []
            },
            text: 'body'
          },
          longpost: {
            title,
            body
          }
        }
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
      expect(wrapper.text()).toContain(title)
      expect(wrapper.text()).toContain(body)
    })
  })
})
