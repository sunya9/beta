import { shallowMount } from 'helpers/client'
import MessageCompose from '~/components/MessageCompose'

describe('MessageCompose component', () => {
  let wrapper, vm
  beforeEach(() => {
    wrapper = shallowMount(MessageCompose)
    vm = wrapper.vm
  })
  it('disabled submit button when empty textarea', () => {
    expect(vm.calcDisabled).to.be.true
  })
  it('disabled when sending message', () => {
    vm.promise = true
    expect(vm.calcDisabled).to.be.true
  })
  it('enabled when textarea is fullfilled', () => {
    wrapper.vm.text = 'a'
    expect(vm.calcDisabled).to.be.false
  })
})
