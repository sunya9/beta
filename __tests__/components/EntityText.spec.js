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
})
