import Vue from 'vue'
import flushPromises from 'flush-promises'
import { Wrapper } from '@vue/test-utils'
import {
  mount,
  authedUserCreateStore,
  baseMountOpts,
  fixtures,
  authedAccessor,
} from '../helper'
import MessageCompose from '~/components/organisms/MessageCompose.vue'
import { Channel } from '~/models/channel'

describe('MessageCompose component', () => {
  let wrapper: Wrapper<Vue>
  beforeEach(() => {
    wrapper = mount(
      MessageCompose,
      baseMountOpts({
        propsData: {
          channel: fixtures<Channel>('channel', 'chat'),
        },
        mocks: {
          $store: authedUserCreateStore(),
          $accessor: authedAccessor(),
        },
      })
    )
  })

  function getBroadcastButtonWrapper() {
    return wrapper.find('[data-test-id="broadcastButton"]')
  }

  function getSubmitButtonWrapper() {
    return wrapper.find('[data-test-id="submitButton"]')
  }

  function getTextareaWrapper() {
    return wrapper.find('[data-test-id="textarea"]')
  }

  test('disabled submit button when empty textarea', () => {
    expect(getBroadcastButtonWrapper().attributes().disabled).toBe('disabled')
  })
  test('disabled when sending message', () => {
    // vm.promise = true
    getTextareaWrapper().setValue('test')
    expect(getBroadcastButtonWrapper().attributes().disabled).toBe('disabled')
  })
  test('disabled when has text over 2048 characters', async () => {
    getTextareaWrapper().setValue('a'.repeat(2058))
    await new Promise((resolve) => setTimeout(resolve, 500))
    expect(getSubmitButtonWrapper().attributes().disabled).toBe('disabled')
  })
  describe('remain', () => {
    test('default remain is 2048', () => {
      const remaining = +wrapper.find('[data-test-id="message-counter"]').text()
      expect(remaining).toBe(2048)
    })
    test('remain equals 1920 when text length is 128', async () => {
      getTextareaWrapper().setValue('a'.repeat(128))
      await new Promise((resolve) => setTimeout(resolve, 500))
      const remaining = +wrapper.find('[data-test-id="message-counter"]').text()
      expect(remaining).toBe(1920)
    })
    test('remain equals 0 when text length is 2048', async () => {
      getTextareaWrapper().setValue('a'.repeat(2048))
      await new Promise((resolve) => setTimeout(resolve, 500))
      const remaining = +wrapper.find('[data-test-id="message-counter"]').text()
      expect(remaining).toBe(0)
    })
    test('remain equals -10 when text length is 2058', async () => {
      getTextareaWrapper().setValue('a'.repeat(2058))
      await new Promise((resolve) => setTimeout(resolve, 500))
      const remaining = +wrapper.find('[data-test-id="message-counter"]').text()
      expect(remaining).toBe(-10)
    })
  })
  // TODO: Write a more detailed test
  test('Can broadcast when channel is publicly and I have a write permission', async () => {
    const wrapper = mount(
      MessageCompose,
      baseMountOpts({
        propsData: {
          channel: fixtures('channel', 'writable', 'publicly'),
        },
        mocks: {
          $store: authedUserCreateStore(),
          $accessor: authedAccessor(),
          $route: {
            params: {
              channel: 1,
            },
          },
        },
      })
    )
    wrapper
      .findComponent({
        ref: 'textarea',
      })
      .setValue('foo')
    expect(
      wrapper
        .findComponent({
          ref: 'dropdown',
        })
        .exists()
    ).toBe(true)
    const handler = jest.fn()
    Vue.prototype.$interactors = {
      createMessage: { run: handler },
    }
    await wrapper.find('[data-test-id="broadcast"]').trigger('click')
    await flushPromises()
    expect(handler).toHaveBeenCalled()
  })
})
