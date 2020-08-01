import { shallowMount } from '../helper'

import InputLongpost from '~/components/organisms/InputLongpost.vue'

describe('InputLongpost component', () => {
  test('initial data is empty', () => {
    const wrapper = shallowMount(InputLongpost)
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
    expect(
      (wrapper.find('textarea').element as HTMLTextAreaElement).value
    ).toBe('')
  })
  test('emitted update:longpost event when longpost is changed', async () => {
    const wrapper = shallowMount(InputLongpost)
    wrapper.find('input').setValue('foo')
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted()['update:longpost']?.[0][0]).toEqual({
      title: 'foo',
      body: '',
    })
    wrapper.find('textarea').setValue('bar')
    expect(wrapper.emitted()['update:longpost']?.[1][0]).toEqual({
      title: 'foo',
      body: 'bar',
    })
  })
})
