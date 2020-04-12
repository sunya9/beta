import { shallowMount } from '../helper'
import Splash from '~/components/Splash.vue'

describe('Splash component', () => {
  test('Called $auth.loginWith when login button is clicked', () => {
    const wrapper = shallowMount(Splash)
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.$auth.loginWith).toHaveBeenCalled()
  })
})
