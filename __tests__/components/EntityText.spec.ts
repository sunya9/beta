import { mount, fixtures } from '../helper'
import EntityText from '~/components/EntityText.vue'
import { Post } from '~/models/post'

// TODO: write tests
describe('EntityText component', () => {
  it('Replace patter links with own domain', () => {
    const content = fixtures<Post>('post', 'hasPatterLink').content
    const wrapper = mount(EntityText, {
      propsData: {
        content,
      },
    })
    expect(wrapper.text().includes('https://beta.pnut.io/channels/0')).toBe(
      true
    )
  })

  // https://github.com/sunya9/beta/issues/221
  test('Markdown links are displayed correctly', () => {
    const wrapper = mount(EntityText, {
      propsData: {
        content: fixtures<Post>('post', 'hasMarkdownLink').content,
      },
    })
    // hacky: @vue/test-utils does not remove spaces between tags
    // (vue renderer remove all whitespaces between tags default)
    expect(wrapper.html()).toContain(
      '<a target="_new" to="https://beta.pnut.io"><span>Beta</span></a> <span> [beta.pnut.io]</span>'
    )
  })
})
