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
    describe('updateCompiledText', () => {
      it('arg equals compiledText', () => {
        vm.updateCompiledText('foo')
        expect(vm.compiledText).is.equal('foo')
        vm.updateCompiledText('bar')
        expect(vm.compiledText).is.equal('bar')
      })
    })
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
  })
})
