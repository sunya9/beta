import Compose from '~/components/Compose'
import { mount, createStore } from 'helpers/client'
import sinon from 'sinon'

describe('Compose component', () => {
  let store, vm, wrapper
  beforeEach(() => {
    store = createStore()
    store.commit('SET_USER', {
      username: 'foo',
      id: 1
    })
    wrapper = mount(Compose, { store })
    vm = wrapper.vm
  })
  describe('computed', () => {
    describe('postCounter', () => {
      it('default postCounter is 256', () => {
        expect(vm.postCounter).is.equal(256)
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
    describe('textOverflow', () => {
      context('when has no text', () => {
        it('should false', () => {
          vm.compiledTextLength = 0
          expect(vm.textOverflow).to.be.false
        })
      })
      context('when has some text within 256 characters', () => {
        it('should false', () => {
          vm.compiledTextLength = 128
          expect(vm.textOverflow).to.be.false
        })
      })
      context('when has some text over 256 characters', () => {
        it('should true', () => {
          vm.compiledTextLength = 260
          expect(vm.textOverflow).to.be.true
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
  })
  describe('methods', () => {
    describe('updateCompiledTextLength', () => {
      it('arg equals compiledTextLength', () => {
        vm.updateCompiledTextLength(0)
        expect(vm.compiledTextLength).is.equal(0)
        vm.updateCompiledTextLength(100)
        expect(vm.compiledTextLength).is.equal(100)
      })
    })
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
    describe('submit', () => {
      context('when has not text', () => {
        it('return false', async () => {
          expect(await vm.submit()).to.be.false
        })
      })
      context('when has text over 256 characters', () => {
        it('return false', async () => {
          vm.compiledTextLength = 260
          expect(await vm.submit()).to.be.false
        })
      })
      context('when text only', () => {
        it('return promise and reset some properties', async () => {
          vm.compiledText = 'foo'
          const res = vm.submit()
          expect(res).to.be.an.instanceof(Promise)
          await res
          expect(vm.promise).to.be.null
          expect(vm.rawText).to.be.a('string').that.is.empty
          expect(vm.photos).to.be.an('array').that.is.empty
        })
      })
      context('when has some photos', () => {
        context('but has not text', () => {
          it('return false', async () => {
            expect(await vm.submit()).to.be.false
          })
        })
        // TODO: write more tests
        // context('with some text', () => {
        //   it('return promise')
        // })
      })
    })
  })
  // context('when unpaid users', () => {
  //   it('add photo is hidden', () => {
  //     console.log(vm.$el)
  //     expect(vm.$el.querySelector('.add-photo')).is.null
  //   })
  // })
  // context('when paid users', () => {
  //   it('add photo is visible', () => {
  //     expect(vm.$el.querySelector('.add-photo')).is.not.null
  //   })
  // })
})
