import Post from '~/components/Post'
import EntityText from '~/components/EntityText'
import { shallowMount, authedUserCreateStore, baseMountOpts } from 'helper'

describe('Post component', () => {
  let wrapper
  const post = {
    id: 1,
    name: 'foo',
    content: {
      entities: {
        links: [],
        mentions: [],
        tags: []
      },
      text: 'lorem'
    },
    is_deleted: false,
    user: {
      name: 'bar',
      username: 'bar',
      content: {
        avatar_image: {
          link: 'example.com',
          height: 1,
          width: 2
        }
      }
    },
    created_at: new Date(),
    counts: {
      bookmarks: 1,
      replies: 2,
      reposts: 3,
      threads: 4
    },
    source: {},
    you_bookmarked: false,
    you_reposted: false
  }
  beforeEach(() => {
    wrapper = shallowMount(
      Post,
      baseMountOpts({
        stubs: {
          EntityText
        },
        mocks: {
          $store: authedUserCreateStore()
        },
        propsData: {
          data: post
        }
      })
    )
  })
  describe('a post deleted', () => {
    test('Show [Post deleted]', async () => {
      wrapper.setProps({
        data: {
          ...post,
          is_deleted: true
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('[Post deleted]')
    })
  })
})
