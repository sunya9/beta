import Interaction from '~/components/Interaction'
import Post from '~/components/Post'
import { mount, authedUserCreateStore, baseMountOpts, fixtures } from 'helper'

describe('Interaction component', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(
      Interaction,
      baseMountOpts({
        mocks: {
          $store: authedUserCreateStore()
        },
        stubs: {
          Post
        },
        propsData: {
          interaction: fixtures('interaction') // dummy
        }
      })
    )
  })
  test('reply', () => {
    wrapper.setProps({
      interaction: fixtures('interaction', 'reply')
    })
    const text = wrapper.text()
    expect(text).toContain('replied') // message
    expect(text).toContain('body') // reply body
  })

  test('bookmark', () => {
    wrapper.setProps({
      interaction: fixtures('interaction', 'bookmark')
    })
    const text = wrapper.text()
    expect(text).toContain('starred') // message
    expect(text).toContain('body') // bookmark body
  })

  test('repost', () => {
    wrapper.setProps({
      interaction: fixtures('interaction', 'repost')
    })
    const text = wrapper.text()
    expect(text).toContain('reposted') // message
    expect(text).toContain('body') // repost body
  })

  test('follow', () => {
    wrapper.setProps({
      interaction: fixtures('interaction', 'follow')
    })
    const text = wrapper.text()
    expect(text).toContain('Followed') // message
    expect(text).not.toContain('body') // have not post
  })
})
