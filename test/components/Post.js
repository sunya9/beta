import Post from '~/components/Post'
import { mount, createStore } from 'helpers/client'

describe('Post component', () => {
  let wrapper, vm, store
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
    store = createStore()
    try {
      wrapper = mount(Post, {
        propsData: {
          data: post
        },
        store
      })
    } catch (e) {
      console.error(e)
    }
    store.commit('SET_USER', {
      username: 'foo',
      id: 1
    })
    vm = wrapper.vm
  })
  context('a post deleted', () => {
    it('Show [Post deleted]', () => {
      vm
    })
  })
})
