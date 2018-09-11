import { shallowMount, axiosMock } from 'helper'
import Poll from '~/components/Poll'

const now = new Date()
const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

const poll = {
  closed_at: nextWeek,
  created_at: now,
  id: '1',
  is_anonymous: false,
  is_public: true,
  options: Array(5)
    .fill()
    .map((option, i) => ({
      text: `option ${i + 1}`,
      position: i + 1
    })),
  poll_id: '1',
  poll_token: 'poll_token'
}
axiosMock.onGet('/polls/1?poll_token=poll_token').reply(200, {
  data: poll
})

describe('Poll component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Poll, {
      propsData: {
        pollId: '1',
        pollToken: 'poll_token'
      }
    })
  })
  test('Poll is not be shown when does not be passed id', () => {
    wrapper.setProps({
      pollId: null
    })
    expect(wrapper.find('.list-group-item').exists()).not.toBe(true)
  })
  test('Poll is shown when passed correct id', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.list-group-item').exists()).toBe(true)
    const text = wrapper.text()
    Array(5)
      .fill()
      .forEach((_, i) => expect(text).toContain(`option ${i + 1}`))
  })
})
