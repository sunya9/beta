import { mount, authedUserCreateStore, fixtures } from 'helper'
import Interaction from '~/components/Interaction'

describe('Interaction component', () => {
  it('reply', () => {
    const wrapper = mount(Interaction, {
      mocks: {
        $store: authedUserCreateStore()
      },
      propsData: {
        interaction: fixtures('interaction', 'reply')
      }
    })
    const text = wrapper.text()
    expect(text).toContain('replied') // message
    expect(text).toContain('body') // reply body
  })

  it('bookmark', () => {
    const wrapper = mount(Interaction, {
      mocks: {
        $store: authedUserCreateStore()
      },
      propsData: {
        interaction: fixtures('interaction', 'bookmark')
      }
    })
    const text = wrapper.text()
    expect(text).toContain('starred') // message
    expect(text).toContain('body') // bookmark body
  })

  it('repost', () => {
    const wrapper = mount(Interaction, {
      mocks: {
        $store: authedUserCreateStore()
      },
      propsData: {
        interaction: fixtures('interaction', 'repost')
      }
    })
    const text = wrapper.text()
    expect(text).toContain('reposted') // message
    expect(text).toContain('body') // repost body
  })

  it('follow', () => {
    const wrapper = mount(Interaction, {
      mocks: {
        $store: authedUserCreateStore()
      },
      propsData: {
        interaction: fixtures('interaction', 'follow')
      }
    })
    const text = wrapper.text()
    expect(text).toContain('Followed') // message
    expect(text).not.toContain('body') // have not post
  })
})
