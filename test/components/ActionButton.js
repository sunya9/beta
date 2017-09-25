import ActionButton from '~/components/ActionButton'
import {
  mount
} from 'helpers/client'

describe('ActionButton component', () => {
  it('initial state equals state', () => {
    const wrapper = mount(ActionButton, {
      propsData: {
        initialState: true
      }
    })
    expect(wrapper.data().state).to.be.true
  })
  describe('toggle state when clicked', () => {
    it('false to true', async () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          initialState: false,
          resource: '/test'
        }
      })
      await wrapper.instance().click()
      expect(wrapper.data().state).to.be.true
    })
    it('true to false', async () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          initialState: true,
          resource: '/test'
        }
      })
      await wrapper.instance().click()
      expect(wrapper.data().state).to.be.false
    })
  })
  describe('method', () => {
    it('method is delete when state equals true', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          initialState: true,
          resource: '/test'
        }
      })
      expect(wrapper.instance().method).to.equals('delete')
    })
    it('method is put when state equals true', () => {
      const wrapper = mount(ActionButton, {
        propsData: {
          initialState: false
        }
      })
      expect(wrapper.instance().method).to.equals('put')
    })
  })
  describe('icon', () => {
    describe('is array', () => {
      const instance = mount(ActionButton, {
        propsData: {
          icon: ['first', 'second']
        }
      }).instance()
      it('return first string when state false', () => {
        instance.state = false
        expect(instance.computedIcon).to.equal('first')
      })
      it('return second string when state true', () => {
        instance.state = true
        expect(instance.computedIcon).to.equal('second')
      })
    })
    describe('is string', () => {
      it('equals icon prop', () => {
        const instance = mount(ActionButton, {
          propsData: {
            icon: 'string'
          }
        }).instance()
        expect(instance.computedIcon).to.equal('string')
      })
    })
  })
})
