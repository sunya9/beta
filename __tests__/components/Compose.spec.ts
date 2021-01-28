import Vue from 'vue'
import { Wrapper } from '@vue/test-utils'
import {
  mount,
  authedUserCreateStore,
  baseMountOpts,
  authedAccessor,
} from '../helper'
import Compose from '~/components/organisms/Compose.vue'
// import EmojiPicker from '~/components/molecules/EmojiPicker.vue'

describe('Compose component', () => {
  let wrapper: Wrapper<InstanceType<typeof Compose>>
  beforeEach(() => {
    wrapper = mount(
      Compose,
      baseMountOpts({
        mocks: {
          $store: authedUserCreateStore(),
          $accessor: authedAccessor(),
        },
        attachTo: document.createElement('div'),
      })
    )
  })
  function type(text: string) {
    wrapper.find('[data-test-id="compose"]').setValue(text)
  }
  describe('postCounter', () => {
    test('default postCounter is 256', () => {
      const remaining = +wrapper.find('[data-test-id="post-counter"]').text()
      expect(remaining).toBe(256)
    })
    describe('when text length is 128', () => {
      test('postCounter equals 128', async () => {
        type('a'.repeat(128))
        await new Promise((resolve) => setTimeout(resolve, 500))
        const remaining = +wrapper.find('[data-test-id="post-counter"]').text()
        expect(remaining).toBe(128)
      })
    })
    describe('when text length is 256', () => {
      test('postCounter equals 0', async () => {
        type('a'.repeat(256))
        await new Promise((resolve) => setTimeout(resolve, 500))
        const remaining = +wrapper.find('[data-test-id="post-counter"]').text()
        expect(remaining).toBe(0)
      })
    })
    describe('when text length is 266', () => {
      test('postCounter equals -10', async () => {
        type('a'.repeat(266))
        await new Promise((resolve) => setTimeout(resolve, 500))
        const remaining = +wrapper.find('[data-test-id="post-counter"]').text()
        expect(remaining).toBe(-10)
      })
    })
  })
  describe('disabled', () => {
    // FIXME
    // disabled textarea and submit button when posted
  })
  // FIXME
  describe('methods', () => {
    describe('submit button', () => {
      let $submitButton: Wrapper<Vue>
      beforeEach(() => {
        $submitButton = wrapper.find('button[type="submit"]')
      })
      describe('has not text', () => {
        test('disabled', () => {
          expect($submitButton.attributes().disabled).toBe('disabled')
        })
      })
      describe('has text over 256 characters', () => {
        test('disabled', () => {
          type('a'.repeat(260))
          expect($submitButton.attributes().disabled).toBe('disabled')
        })
      })
      describe('has some photos but has not text', () => {
        test('disabled', () => {
          expect($submitButton.attributes().disabled).toBe('disabled')
        })
      })
    })
  })
  describe('picker button', () => {
    test('is visible', () => {
      expect(wrapper.find('.open-emoji-picker').element).toBeVisible()
    })
    describe('clicked picker button', () => {
      // let emojiPicker: Wrapper<Vue>
      beforeEach(() => {
        wrapper.find('.open-emoji-picker').trigger('click')
        // emojiPicker = wrapper.findComponent(EmojiPicker)
      })
    })
  })
})
