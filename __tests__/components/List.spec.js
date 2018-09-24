import { mount } from 'helper'
import BaseList from '~/components/BaseList'

describe('BaseList component', () => {
  // https://github.com/sunya9/beta/issues/196
  test('Can refresh even when list is empty', async () => {
    const wrapper = mount(BaseList, {
      propsData: {
        data: {
          meta: {
            more: false
          },
          data: []
        },
        resource: '/200'
      }
    })
    const spy = jest.spyOn(wrapper.vm, 'refresh')
    await wrapper.vm.refresh()
    expect(spy).toHaveBeenCalled()
    expect(spy).not.toThrow()
  })

  test("Show a message when hasn't amy items", () => {
    const wrapper = mount(BaseList, {
      propsData: {
        data: {
          meta: {
            more: false
          },
          data: []
        },
        resource: '/200'
      }
    })
    expect(wrapper.text().toLowerCase()).toContain('No Items'.toLowerCase())
  })
  test('Calls refersh() when refreshDate is updated', () => {
    const wrapper = mount(BaseList, {
      propsData: {
        data: {
          meta: {
            more: false
          },
          data: []
        },
        refreshDate: Date.now(),
        resource: '/200'
      }
    })
    const handler = jest.fn()
    wrapper.vm.refresh = handler
    expect(handler).not.toHaveBeenCalled()
    wrapper.setProps({
      refreshDate: Date.now()
    })
    expect(handler).toHaveBeenCalled()
  })
})
