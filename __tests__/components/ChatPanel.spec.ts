import { shallowMount, fixtures, createStore } from '../helper'
import ChatPanel from '~/components/organisms/ChatPanel.vue'
import { Channel } from '~/entity/channel'
import { ChatRoomSettings } from '~/entity/raw/raw/chat-room-settings'

describe('ChatPanel component', () => {
  test('Show RSS Link when publicly channel', () => {
    const chat = fixtures<Channel>('channel', 'chat')!
      .raw![0] as ChatRoomSettings
    const wrapper = shallowMount(ChatPanel, {
      propsData: {
        initialChannel: fixtures('channel', 'publicly', 'chat'),
        chat,
      },
      mocks: {
        $metaInfo: {},
        $store: createStore(),
      },
    })
    expect(
      wrapper
        .find('a[href^="https://api.pnut.io/v0/feed/rss/channels/"]')
        .exists()
    ).toBe(true)
  })
})
