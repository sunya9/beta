import { Wrapper } from '@vue/test-utils'
import { mount } from '../helper'
import BaseList from '~/components/BaseList.vue'
import { createListInfo } from '~/plugins/domain/util/util'

type BaseListType = InstanceType<typeof BaseList> & {
  refresh: () => Promise<void>
}

describe('BaseList component', () => {
  // https://github.com/sunya9/beta/issues/196
  test('Can refresh even when list is empty', async () => {
    const wrapper = mount(BaseList, {
      propsData: {
        listInfo: await createListInfo(() =>
          Promise.resolve({ meta: { code: 200 }, data: [] })
        ),
      },
    }) as Wrapper<BaseListType>
    const spy = jest.spyOn(wrapper.vm, 'refresh')
    await wrapper.vm.refresh()
    expect(spy).toHaveBeenCalled()
    expect(spy).not.toThrow()
  })

  test("Show a message when hasn't any items", async () => {
    const wrapper = mount(BaseList, {
      propsData: {
        listInfo: await createListInfo(() =>
          Promise.resolve({ meta: { code: 200 }, data: [] })
        ),
      },
    }) as Wrapper<BaseListType>
    expect(wrapper.text().toLowerCase()).toContain('No Items'.toLowerCase())
  })
  test('Calls refersh() when refreshDate is updated', async () => {
    const wrapper = mount(BaseList, {
      propsData: {
        listInfo: await createListInfo(() =>
          Promise.resolve({ meta: { code: 200 }, data: [] })
        ),
        refreshDate: Date.now(),
      },
    }) as Wrapper<BaseListType>
    const handler = jest.fn()
    wrapper.vm.refresh = handler
    expect(handler).not.toHaveBeenCalled()
    wrapper.setProps({
      refreshDate: Date.now(),
    })
    await wrapper.vm.$nextTick()
    expect(handler).toHaveBeenCalled()
  })
})
