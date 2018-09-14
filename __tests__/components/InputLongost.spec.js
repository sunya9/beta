import { shallowMount } from 'helper'

import InputLongpost from '~/components/InputLongpost'

describe('InputLongpost component', () => {
  test('initial data is empty', () => {
    const wrapper = shallowMount(InputLongpost)
    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.find('textarea').element.value).toBe('')
  })
  test('emitted update:longpost event when longpost is changed', async () => {
    const wrapper = shallowMount(InputLongpost)
    wrapper.find('input').setValue('foo')
    expect(wrapper.emitted()['update:longpost'][0][0]).toEqual({
      title: 'foo',
      body: ''
    })
    wrapper.find('textarea').setValue('bar')
    expect(wrapper.emitted()['update:longpost'][1][0]).toEqual({
      title: 'foo',
      body: 'bar'
    })
  })
})
