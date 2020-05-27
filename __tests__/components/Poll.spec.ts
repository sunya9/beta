import { Wrapper, ThisTypedMountOptions } from '@vue/test-utils'
import {
  mount,
  createStore,
  authedUserCreateStore,
  fixtures,
  authedAccessor,
} from '../helper'
import PollView from '~/components/Poll.vue'
import { Poll } from '~/models/poll'

describe('Poll component', () => {
  let wrapper: Wrapper<InstanceType<typeof PollView>>
  let opts: ThisTypedMountOptions<InstanceType<typeof PollView>>
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
    wrapper = mount(PollView, opts)
    expect(wrapper.element).not.toBeNull()
    const text = wrapper.text()
    Array(5)
      .fill(undefined)
      .forEach((_, i) => expect(text).toContain(`option ${i + 1}`))
  })
  describe('Voting is held', () => {
    test('Show tilde', () => {
      wrapper = mount(PollView, opts)
      expect(wrapper.text()).toContain('~')
    })
    test('Disable vote butons when logged out', () => {
      wrapper = mount(PollView, opts)
      expect(wrapper.find('a.disabled').exists()).toBe(true)
    })
    test('Enable vote butons when logged in', () => {
      wrapper = mount(PollView, {
        ...opts,
        mocks: {
          $store: authedUserCreateStore(),
          $accessor: authedAccessor(),
        },
      })
      expect(wrapper.find('a.disabled').exists()).toBe(false)
    })
  })
  describe('Voting is over', () => {
    test('Show closed at', () => {
      wrapper = mount(PollView, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'closed'),
        },
      })
      expect(wrapper.text()).toContain('Closed at')
    })
    test('Show the result when poll has been closed', () => {
      wrapper = mount(PollView, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'closed'),
        },
      })
      expect(wrapper.find('.progress').exists()).toBe(true)
    })
    test('Show the result and checkmark when you respond', () => {
      wrapper = mount(PollView, {
        ...opts,
        propsData: {
          ...opts.propsData,
          poll: fixtures<Poll>('poll', 'detail', 'responded'),
        },
      })
      expect(wrapper.find('.fa-check').exists()).toBe(true)
    })
    test('Calc percentage and toggle display', () => {
      wrapper = mount(PollView, {
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
      wrapper = mount(PollView, {
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
