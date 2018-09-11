import { mount } from 'helper'
import List from '~/components/List'

describe('List component', () => {
  // https://github.com/sunya9/beta/issues/196
  test('Can refresh even when list is empty', async () => {
    const wrapper = mount(List, {
      propsData: {
        type: 'Post',
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
})
