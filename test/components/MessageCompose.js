import { shallow } from 'helpers/client'
import MessageCompose from '~/components/MessageCompose'

describe('MessageCompose component', () => {
  let wrapper, vm
  beforeEach(() => {
    wrapper = shallow(MessageCompose)
    vm = wrapper.vm
  })
  it('disabled submit button when empty textarea', () => {
    expect(vm.calcDisabled).to.be.true
  })
  it('disabled when `disabled` prop is true', () => {
    wrapper.setProps({ disabled: true })
    expect(vm.calcDisabled).to.be.true
  })
  it('disabled when sending message', () => {
    vm.promise = true
    expect(vm.calcDisabled).to.be.true
  })
  it('enabled when textarea is fullfilled', () => {
    wrapper.setProps({ value: 'foo' })
    expect(vm.calcDisabled).to.be.false
  })
})
