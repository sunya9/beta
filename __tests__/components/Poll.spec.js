import { shallowMount, createStore } from 'helper'
import Poll from '~/components/Poll'

describe('Poll component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(Poll, {
      propsData: {
        pollId: '1',
        pollToken: 'poll_token'
      },
      mocks: {
        $store: createStore()
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
  test('Disabled vote butons when logged out', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.contains('.list-group-item a.disabled')).toBe(true)
  })
  test('enabled vote butons when logged in', async () => {
    await wrapper.vm.$nextTick()
    expect(wrapper.contains('.list-group-item a.disabled')).not.toBe(false)
  })
})
