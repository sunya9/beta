import { shallowMount, fixtures, createStore } from 'helper'
import ChannelPanel from '~/components/ChannelPanel'

describe('ChannelPanel component', () => {
  test('Show RSS Link when publicly channel', () => {
    const wrapper = shallowMount(ChannelPanel, {
      propsData: {
        initialChannel: fixtures('channel', 'publicly')
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
