import { Wrapper } from '@vue/test-utils'
import { shallowMount, stub } from '../../../helper'
import Index from '~/components/molecules/settings/Account/index.vue'

describe('settings/Account/index component', () => {
  let wrapper: Wrapper<Vue>
  beforeEach(() => {
    wrapper = shallowMount(Index, {
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
    await wrapper.find('form').trigger('submit')
    expect(wrapper.vm.$axios.$patch).toBeCalled()
    expect(wrapper.vm.$toast.success).toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).not.toHaveBeenCalled()
  })
  test('show error toast', async () => {
    wrapper.vm.$axios.$patch = jest.fn(() => {
      throw new Error('error')
    })
    await wrapper.find('form').trigger('submit')
    expect(wrapper.vm.$axios.$patch).toThrow()
    expect(wrapper.vm.$toast.success).not.toHaveBeenCalled()
    expect(wrapper.vm.$toast.error).toHaveBeenCalled()
  })
})
