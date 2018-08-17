import Post from '~/components/Post'
import EntityText from '~/components/EntityText'
import { shallowMount, authedUserCreateStore } from 'helpers/client'

describe('Post component', () => {
  let wrapper, store
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
      username: '@bar',
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
    store = authedUserCreateStore()
    wrapper = shallowMount(Post, {
      propsData: {
        data: post
      },
      store,
      stubs: {
        EntityText
      }
    })
  })
  describe('a post deleted', () => {
    it('Show [Post deleted]', async () => {
      // wrapper.setProps({
      //   data: { ...post,
      //     is_deleted: true
      //   }
      // })
      wrapper = shallowMount(Post, {
        propsData: {
          data: {
            ...post,
            is_deleted: true
          }
        },
        store,
        stubs: {
          EntityText
        }
      })
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).to.contain('[Post deleted]')
    })
  })
})
