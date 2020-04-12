import { Wrapper } from '@vue/test-utils'
import { shallowMount, stub } from '../../../helper'
import Index from '~/components/settings/Account/index.vue'

type IndexType = Index & { update: () => Promise<void> }

describe('settings/Account/index component', () => {
  let wrapper: Wrapper<IndexType>
  beforeEach(() => {
    wrapper = shallowMount<IndexType>(Index, {
      propsData: {
        account: {
          name: 'foo',
          content: {
            text: 'bar',
          },
          timezone: '',
          locale: '',
        },
      },
      stubs: {
        Avatar: stub,
        Cover: stub,
      },
    })
    wrapper.vm.$toast.error = jest.fn()
    wrapper.vm.$toast.success = jest.fn()
  })
  test('show success toast', async () => {
    wrapper.vm.$axios.$patch = jest.fn()
    await wrapper.vm.update()
    expect(wrapper.vm.$toast.success).toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).not.toHaveBeenCalled()
  })
  test('show error toast', async () => {
    wrapper.vm.$axios.$patch = jest.fn(() => {
      throw new Error('error')
    })
    await wrapper.vm.update()
    expect(wrapper.vm.$toast.success).not.toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
  })
})
