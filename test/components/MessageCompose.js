import MessageCompose from '~/components/MessageCompose'
import { mount, createStore } from 'helpers/client'

import noSsr from 'nuxt/lib/app/components/no-ssr'

describe('MessageCompose component', () => {
  let store, vm, wrapper
  beforeEach(() => {
    store = createStore()
    store.commit('SET_USER', {
      username: 'foo',
      id: 1,
      storage: {
        available: 0
      }
    })
    wrapper = mount(MessageCompose, {
      mocks: {
        $store: store
      },
      stubs: {
        noSsr,
        picker: true
      }
    })
    vm = wrapper.vm
  })
  it('disabled submit button when empty textarea', () => {
    expect(vm.calcDisabled).to.be.true
  })
  it('disabled when sending message', () => {
    vm.promise = true
    expect(vm.calcDisabled).to.be.true
  })
  describe('methods', () => {
    describe('submit button', () => {
      let $submitButton
      beforeEach(() => {
        $submitButton = wrapper.find('button[type="submit"]')
      })
      context('has no text', () => {
        it('disabled ', () => {
          expect($submitButton.attributes().disabled).to.equal('disabled')
        })
      })
      context('has text over 2048 characters', () => {
        it('disabled ', () => {
          vm.text = 'a'.repeat(2058)
          expect($submitButton.attributes().disabled).to.equal('disabled')
        })
      })
      context('has some photos but no text', () => {
        it('disabled', () => {
          expect($submitButton.attributes().disabled).to.equal('disabled')
        })
      })
      // TODO: write more tests
      // context('with some text', () => {
      //   it('return promise')
      // })
    })
  })
  describe('remain', () => {
    it('default remain is 2048', () => {
      const remaining = +wrapper.find('[data-test-id="message-counter"]').text()
      expect(remaining).is.equal(2048)
    })
    context('when text length is 128', () => {
      it('remain equals 128', async () => {
        vm.text = 'a'.repeat(128)
        await new Promise(resolve => setTimeout(resolve, 500))
        const remaining = +wrapper
          .find('[data-test-id="message-counter"]')
          .text()
        expect(remaining).is.equal(128)
      })
    })
    context('when text length is 2048', () => {
      it('remain equals 0 ', async () => {
        vm.text = 'a'.repeat(2048)
        await new Promise(resolve => setTimeout(resolve, 500))
        const remaining = +wrapper
          .find('[data-test-id="message-counter"]')
          .text()
        expect(remaining).is.equal(0)
      })
    })
    context('when text length is 2058', () => {
      it('remain equals -10', async () => {
        vm.text = 'a'.repeat(2058)
        await new Promise(resolve => setTimeout(resolve, 500))
        const remaining = +wrapper
          .find('[data-test-id="message-counter"]')
          .text()
        expect(remaining).is.equal(-10)
      })
    })
  })
  describe('add photo button', () => {
    context('when unpaid a user', () => {
      it('is hidden', () => {
        expect(wrapper.find('.add-photo').exists()).is.false
      })
    })
    context('when paid a user', () => {
      it('is shown', () => {
        store.commit('SET_USER', {
          username: 'foo',
          id: 1,
          storage: {
            available: 1
          }
        })
        expect(wrapper.find('.add-photo').exists()).is.true
      })
    })
  })
})
