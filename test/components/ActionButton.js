import ActionButton from '~/components/ActionButton'
import { mount } from 'helpers/client'

describe('ActionButton component', () => {
  describe('toggle state when clicked', () => {
    it('false to true', async () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          checked: false,
          resource: '/test'
        }
      })

      // avoriaz does not support v-model testing
      // So, change event handling need to describe by myself.
      let res
      wrapper.vm.$on('change', checked => (res = checked))
      wrapper.vm.change(!wrapper.vm.checked)
      // ???
      // wrapper.first('input').checked = true
      // wrapper.first('input').trigger('change', true)
      await wrapper.vm.$nextTick()
      expect(res).to.be.true
    })
    it('true to false', async () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          checked: true,
          resource: '/test'
        }
      })
      let res
      wrapper.vm.$on('change', checked => (res = checked))
      wrapper.vm.change(!wrapper.vm.checked)
      // wrapper.first('input').checked = false
      // wrapper.first('input').trigger('change', false)
      await wrapper.vm.$nextTick()
      expect(res).to.be.false
    })
  })
  describe('method', () => {
    it('method is delete when state equals true', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          checked: true,
          resource: '/test'
        }
      })
      expect(wrapper.vm.method).to.equals('delete')
    })
    it('method is put when state equals true', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          checked: false
        }
      })
      expect(wrapper.vm.method).to.equals('put')
    })
  })
  describe('icon', () => {
    describe('is array', () => {
      const instance = mount(ActionButton, {
        propsData: {
          icon: ['first', 'second']
        }
      }).vm
      it('return first string when state false', () => {
        instance.checked = false
        expect(instance.computedIcon).to.equal('first')
      })
      it('return second string when state true', () => {
        instance.checked = true
        expect(instance.computedIcon).to.equal('second')
      })
    })
    describe('is string', () => {
      it('equals icon prop', () => {
        const instance = mount(ActionButton, {
          propsData: {
            icon: 'string'
          }
        }).vm
        expect(instance.computedIcon).to.equal('string')
      })
    })
  })
})
