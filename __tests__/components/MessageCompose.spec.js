import MessageCompose from '~/components/MessageCompose'
import { mount, authedUserCreateStore, baseMountOpts } from 'helper'

describe('MessageCompose component', () => {
  let vm, wrapper
  beforeEach(() => {
    wrapper = mount(
      MessageCompose,
      baseMountOpts({
        mocks: {
          $store: authedUserCreateStore()
        }
      })
    )
    vm = wrapper.vm
  })
  test('disabled submit button when empty textarea', () => {
    expect(vm.calcDisabled).toBe(true)
  })
  test('disabled when sending message', () => {
    vm.promise = true
    expect(vm.calcDisabled).toBe(true)
  })
  describe('methods', () => {
    describe('submit button', () => {
      let $submitButton
      beforeEach(() => {
        $submitButton = wrapper.find('button[type="submit"]')
      })
      describe('has no text', () => {
        test('disabled ', () => {
          expect($submitButton.attributes().disabled).toBe('disabled')
        })
      })
      describe('has text over 2048 characters', () => {
        test('disabled ', () => {
          vm.compiledTextLength = 'a'.repeat(2058)
          expect($submitButton.attributes().disabled).toBe('disabled')
        })
      })
      describe('has some photos but no text', () => {
        test('disabled', () => {
          expect($submitButton.attributes().disabled).toBe('disabled')
        })
      })
      // TODO: write more tests
      // describe('with some text', () => {
      //   test('return promise')
      // })
    })
  })
  describe('remain', () => {
    test('default remain is 2048', () => {
      const remaining = +wrapper.find('[data-test-id="message-counter"]').text()
      expect(remaining).toBe(2048)
    })
    describe('when text length is 128', () => {
      test('remain equals 1920', async () => {
        vm.text = 'a'.repeat(128)
        await new Promise(resolve => setTimeout(resolve, 500))
        const remaining = +wrapper
          .find('[data-test-id="message-counter"]')
          .text()
        expect(remaining).toBe(1920)
      })
    })
    describe('when text length is 2048', () => {
      test('remain equals 0 ', async () => {
        vm.text = 'a'.repeat(2048)
        await new Promise(resolve => setTimeout(resolve, 500))
        const remaining = +wrapper
          .find('[data-test-id="message-counter"]')
          .text()
        expect(remaining).toBe(0)
      })
    })
    describe('when text length is 2058', () => {
      test('remain equals -10', async () => {
        vm.text = 'a'.repeat(2058)
        await new Promise(resolve => setTimeout(resolve, 500))
        const remaining = +wrapper
          .find('[data-test-id="message-counter"]')
          .text()
        expect(remaining).toBe(-10)
      })
    })
  })
})
