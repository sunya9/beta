import { mount, RouterLinkStub as NuxtLink } from 'helper'
// import NuxtLink from 'nuxt/lib/app/components/nuxt-link'
import NuxtLinkMod from '~/components/NuxtLinkMod'

describe('NuxtLinkMod component', () => {
  test('If include own domain, use <nuxt-link>', () => {
    const wrapper = mount(NuxtLinkMod, {
      propsData: {
        to: 'https://beta.pnut.io/mentions'
      },
      stubs: {
        NuxtLink
      }
    })
    const nuxtLinkWrapper = wrapper.find(NuxtLink)
    expect(nuxtLinkWrapper.exists()).toBe(true)
    expect(nuxtLinkWrapper.props().to).toBe('/mentions')
  })
  test('If not include own domain, use <a>', () => {
    const wrapper = mount(NuxtLinkMod, {
      propsData: {
        to: 'https://example.com/foo'
      },
      stubs: {
        NuxtLink
      }
    })
    const aWrapper = wrapper.find('a')
    expect(aWrapper.exists()).toBe(true)
    expect(aWrapper.attributes().href).toBe('https://example.com/foo')
  })
})
