import index from '~/components/settings/Account'
import { shallow } from 'helpers/client'
import sinon from 'sinon'

describe('settings/Account/index component', () => {
  let wrapper, $toast
  beforeEach(() => {
    wrapper = shallow(index, {
      propsData: {
        account: {
          name: 'foo',
          content: {
            markdown_text: 'bar'
          },
          timezone: '',
          locale: ''
        }
      }
    })
    $toast = wrapper.vm.$toast
  })
  context('success', () => {
    it('show success toast', async () => {
      wrapper.vm.$axios = {
        $patch: sinon.stub()
      }
      await wrapper.vm.update()
      expect($toast.success.called).to.be.true
      expect($toast.error.called).to.be.false
    })
  })
  context('error', () => {
    it('show error toast', async () => {
      wrapper.vm.$axios = {
        $patch: sinon.stub().throws()
      }
      await wrapper.vm.update()
      expect($toast.success.called).to.be.false
      expect($toast.error.called).to.be.true
    })
  })
})
