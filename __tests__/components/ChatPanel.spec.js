import { shallowMount, fixtures, createStore } from 'helper'
import ChatPanel from '~/components/ChatPanel'

describe('ChatPanel component', () => {
  test('Show RSS Link when publicly channel', () => {
    const wrapper = shallowMount(ChatPanel, {
      propsData: {
        initialChannel: fixtures('channel', 'publicly', 'chat'),
        chat: fixtures('channel', 'chat').raw[0]
      },
      mocks: {
        $metaInfo: {},
        $store: createStore()
      }
    })
    expect(
      wrapper.contains('a[href^="https://api.pnut.io/v0/feed/rss/channels/"]')
    ).toBe(true)
  })
})
