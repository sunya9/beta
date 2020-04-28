import { Wrapper, ThisTypedMountOptions } from '@vue/test-utils'
import {
  mount,
  createStore,
  authedUserCreateStore,
  fixtures,
  authedAccessor,
} from '../helper'
import Poll from '~/components/Poll.vue'

describe('Poll component', () => {
  let wrapper: Wrapper<Poll>
  let opts: ThisTypedMountOptions<Poll>
  beforeEach(() => {
    opts = {
      propsData: {
        pollId: '1',
        pollToken: 'poll_token',
        poll: fixtures('poll'),
      },
      mocks: {
        $store: createStore(),
      },
    }
  })
  test('Poll is shown when passed correct id', () => {
    wrapper = mount(Poll, opts)
    expect(wrapper.isEmpty()).toBe(false)
    const text = wrapper.text()
    Array(5)
      .fill(undefined)
      .forEach((_, i) => expect(text).toContain(`option ${i + 1}`))
  })
  describe('Voting is held', () => {
    test('Show tilde', () => {
      wrapper = mount(Poll, opts)
      expect(wrapper.text()).toContain('~')
    })
    test('Disable vote butons when logged out', () => {
      wrapper = mount(Poll, opts)
      expect(wrapper.contains('a.disabled')).toBe(true)
    })
    test('Enable vote butons when logged in', () => {
      wrapper = mount(Poll, {
        ...opts,
        mocks: {
          $store: authedUserCreateStore(),
          $accessor: authedAccessor(),
        },
      })
      expect(wrapper.contains('a.disabled')).toBe(false)
    })
  })
  describe('Voting is over', () => {
    test('Show closed at', () => {
      wrapper = mount(Poll, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'closed'),
        },
      })
      expect(wrapper.text()).toContain('Closed at')
    })
    test('Show the result when poll has been closed', () => {
      wrapper = mount(Poll, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'closed'),
        },
      })
      expect(wrapper.contains('.progress')).toBe(true)
    })
    test('Show the result and checkmark when you respond', () => {
      wrapper = mount(Poll, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'detail', 'responded'),
        },
      })
      expect(wrapper.contains('.fa-check')).toBe(true)
    })
    test('Calc percentage and toggle display', () => {
      wrapper = mount(Poll, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'detail', 'responded'),
        },
      })
      expect(wrapper.text()).toContain('100%')
      expect(wrapper.text()).toContain('0%')
      const progresses = wrapper.findAll('.progress')
      progresses.at(0).trigger('click')
      expect(progresses.at(0).text()).toContain('1')
      expect(progresses.at(1).text()).toContain('0')
      expect(progresses.at(2).text()).toContain('0')
      expect(progresses.at(3).text()).toContain('0')
      expect(progresses.at(4).text()).toContain('0')
      progresses.at(0).trigger('click')
      expect(wrapper.text()).toContain('100%')
      expect(wrapper.text()).toContain('0%')
    })
    test('Show total', () => {
      wrapper = mount(Poll, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'detail', 'responded'),
        },
      })
      expect(wrapper.text()).toContain('Total: 1')
    })
  })
})
