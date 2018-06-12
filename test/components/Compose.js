import Compose from '~/components/Compose'
import { mount, createStore } from 'helpers/client'

import sinon from 'sinon'
import noSsr from 'nuxt/lib/app/components/no-ssr'

describe('Compose component', () => {
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
    wrapper = mount(Compose, {
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
  describe('postCounter', () => {
    it('default postCounter is 256', () => {
      const remaining = +wrapper.find('[data-test-id="post-counter"]').text()
      expect(remaining).is.equal(256)
    })
    context('when text length is 128', () => {
      it('postCounter equals 128', () => {
        vm.compiledTextLength = 128
        expect(vm.postCounter).is.equal(128)
      })
    })
    context('when text length is 256', () => {
      it('postCounter equals 0 ', () => {
        vm.compiledTextLength = 256
        expect(vm.postCounter).is.equal(0)
      })
    })
    context('when text length is 266', () => {
      it('postCounter equals -10', () => {
        vm.compiledTextLength = 266
        expect(vm.postCounter).is.equal(-10)
      })
    })
  })
  describe('hasNotText', () => {
    context('when has no text', () => {
      it('should true', () => {
        vm.compiledTextLength = 0
        expect(vm.hasNotText).to.be.true
      })
    })
    context('when has some text', () => {
      it('should false', () => {
        vm.compiledTextLength = 128
        expect(vm.hasNotText).to.be.false
      })
    })
  })
  describe('disabled', () => {
    context('when sending', () => {
      it('should true', () => {
        vm.promise = true
        expect(vm.disabled).to.be.true
      })
    })
    context('when compiledTextLength is 0', () => {
      it('should true', () => {
        vm.compiledTextLength = 0
        expect(vm.disabled).to.be.true
      })
    })
    context('when postCounter is negative', () => {
      it('should true', () => {
        vm.compiledTextLength = 260
        expect(vm.disabled).to.be.true
      })
    })
    context('when fulfill conditions', () => {
      it('should false', () => {
        vm.compiledTextLength = 10
        vm.promise = null
        expect(vm.disabled).to.be.false
      })
    })
  })
  // FIXME
  describe('methods', () => {
    describe('setFocus', () => {
      context('when focus prop is object', () => {
        it('can pass object', () => {
          wrapper.setProps({
            focus: [0, 10]
          })
          expect(vm.$props.focus).to.be.deep.equal([0, 10])
        })
        it('can call setCaret', () => {
          wrapper.setProps({
            focus: [0, 10]
          })
          vm.$refs.textarea.setCaret = sinon.stub()
          vm.setFocus()
          expect(vm.$refs.textarea.setCaret.called).to.be.true
        })
      })
      context('when focus prop is string or number', () => {
        it('can pass string or number', () => {
          wrapper.setProps({
            focus: 1
          })
          expect(vm.$props.focus).to.be.equal(1)
          wrapper.setProps({
            focus: '1'
          })
          expect(vm.$props.focus).to.be.equal('1')
        })
        it('can call setCaret', () => {
          wrapper.setProps({
            focus: 1
          })
          vm.$refs.textarea.setCaret = sinon.stub()
          vm.setFocus()
          expect(vm.$refs.textarea.setCaret.called).to.be.true
          wrapper.setProps({
            focus: '1'
          })
          vm.$refs.textarea.setCaret = sinon.stub()
          vm.setFocus()
          expect(vm.$refs.textarea.setCaret.called).to.be.true
        })
      })
      context('when focus prop is boolean', () => {
        it('can pass boolean', () => {
          wrapper.setProps({
            focus: true
          })
          expect(vm.$props.focus).to.be.true
          wrapper.setProps({
            focus: false
          })
          expect(vm.$props.focus).to.be.false
        })
        context('when boolean is true', () => {
          it('can call setCaret', () => {
            wrapper.setProps({
              focus: true
            })
            vm.$refs.textarea.setCaret = sinon.stub()
            vm.setFocus()
            expect(vm.$refs.textarea.setCaret.called).to.be.true
          })
        })
        context('when boolean is false', () => {
          it('cannot call setCaret', () => {
            wrapper.setProps({
              focus: false
            })
            vm.$refs.textarea.setCaret = sinon.stub()
            vm.setFocus()
            expect(vm.$refs.textarea.setCaret.notCalled).to.be.true
          })
        })
      })
    })
    describe('submit button', () => {
      let $submitButton
      beforeEach(() => {
        $submitButton = wrapper.find('button[type="submit"]')
      })
      context('has not text', () => {
        it('disabled ', () => {
          expect($submitButton.attributes().disabled).to.equal('disabled')
        })
      })
      context('has text over 256 characters', () => {
        it('disabled ', () => {
          vm.compiledTextLength = 260
          expect($submitButton.attributes().disabled).to.equal('disabled')
        })
      })
      context('text only', () => {
        it('return promise and reset some properties ', async () => {
          vm.compiledText = 'foo'
          const res = vm.submit()
          expect(res).to.be.an.instanceof(Promise)
          await res
          expect(vm.promise).to.be.null
          expect(vm.rawText).to.be.a('string').that.is.empty
          expect(vm.photos).to.be.an('array').that.is.empty
        })
      })
      context('has some photos but has not text', () => {
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
  describe('picker button', () => {
    it('is visible', () => {
      expect(wrapper.find('.open-emoji-picker').isVisible()).to.be.true
    })
    context('clicked picker button', () => {
      let emojiPicker
      beforeEach(async () => {
        wrapper.find('.open-emoji-picker').trigger('click')
        emojiPicker = wrapper.find({
          ref: 'picker'
        })
      })
      it('emoji palette is visible', () => {
        expect(emojiPicker.isVisible()).is.true
      })
    })
    context('selected any emoji', () => {
      let textarea
      beforeEach(() => {
        wrapper.vm.addEmoji = sinon.stub()
        wrapper.vm.closeEmojiPalette = sinon.stub()
        textarea = wrapper.find({
          ref: 'textarea'
        })
        textarea.vm.insertText = sinon.stub()
        wrapper.find('.open-emoji-picker').trigger('click')
        wrapper
          .find({
            ref: 'picker'
          })
          .vm.$emit('select')
      })
      it('called addEmoji', () => {
        expect(wrapper.vm.addEmoji.called).to.be.true
      })
    })
    context('addEmoji', () => {
      it('called insertText', async () => {
        const textarea = wrapper.find({
          ref: 'textarea'
        })
        textarea.vm.insertText = sinon.stub()
        expect(textarea.isVisible()).to.be.true
        wrapper.vm.addEmoji({
          native: '🤔'
        })
        await textarea.vm.$nextTick()
        expect(textarea.vm.insertText.called).to.be.true
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
