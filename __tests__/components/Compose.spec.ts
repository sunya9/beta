import { Wrapper } from '@vue/test-utils'
import {
  mount,
  authedUserCreateStore,
  baseMountOpts,
  authedAccessor,
} from '../helper'
import Compose from '~/components/organisms/Compose.vue'

// import noSsr from 'nuxt/lib/app/components/no-ssr'

describe('Compose component', () => {
  let vm: InstanceType<typeof Compose>
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
    vm = wrapper.vm
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
      test('postCounter equals 0 ', async () => {
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
    describe('setFocus', () => {
      describe('when focus prop is object', () => {
        test('can pass object', () => {
          wrapper.setProps({
            focus: [0, 10],
          })
          expect(vm.$props.focus).toEqual([0, 10])
        })
      })
      describe('when focus prop is string or number', () => {
        test('can pass string or number', () => {
          wrapper.setProps({
            focus: 1,
          })
          expect(vm.$props.focus).toBe(1)
          wrapper.setProps({
            focus: '1',
          })
          expect(vm.$props.focus).toBe('1')
        })
      })
      describe('when focus prop is boolean', () => {
        test('can pass boolean', () => {
          wrapper.setProps({
            focus: true,
          })
          expect(vm.$props.focus).toBe(true)
          wrapper.setProps({
            focus: false,
          })
          expect(vm.$props.focus).toBe(false)
        })
      })
    })
    describe('submit button', () => {
      let $submitButton: Wrapper<Vue>
      beforeEach(() => {
        $submitButton = wrapper.find('button[type="submit"]')
      })
      describe('has not text', () => {
        test('disabled ', () => {
          expect($submitButton.attributes().disabled).toBe('disabled')
        })
      })
      describe('has text over 256 characters', () => {
        test('disabled ', () => {
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
      let emojiPicker: Wrapper<Vue>
      beforeEach(() => {
        wrapper.find('.open-emoji-picker').trigger('click')
        emojiPicker = wrapper.findComponent({
          ref: 'picker',
        })
      })
      test('emoji palette is visible', () => {
        expect(emojiPicker.element).toBeVisible()
      })
    })
  })
})
