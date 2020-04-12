import * as util from '~/assets/ts/util'
import { fixtures } from '~/__tests__/helper'
import { Post } from '~/models/post'
import { Channel } from '~/models/channel'

describe('util', () => {
  test('getRSSLink', () => {
    expect(util.getRSSLink('foo')).toEqual({
      hid: 'rss',
      rel: 'alternate',
      type: 'application/rss+xml',
      href: 'foo',
    })
  })
  describe('getImageURLs', () => {
    it('get from link', () => {
      const post = fixtures<Post>('post')
      expect(
        util.getImageURLs({
          ...post,
          content: {
            ...post.content!,
            entities: {
              links: [
                {
                  link: 'photo.jpeg',
                  len: 'photo.jpeg'.length,
                  pos: 0,
                  text: 'photo.jpeg',
                },
              ],
              mentions: [],
              tags: [],
            },
          },
        })
      ).toEqual([
        {
          thumb: 'photo.jpeg',
          original: 'photo.jpeg',
        },
      ])
    })
    it('get from raw', () => {
      expect(
        util.getImageURLs(
          {
            ...fixtures<Post>('post'),
            raw: [
              {
                type: 'io.pnut.core.oembed',
                value: {
                  type: 'photo',
                  url: 'original.png',
                  thumbnail_url: 'thumbnail.png',
                },
              },
            ],
          },
          true
        )
      ).toMatchObject([
        {
          thumb: 'thumbnail.png',
          original: 'original.png',
        },
      ])
    })
    it('Remove duplicate', () => {
      const post = fixtures<Post>('post')
      expect(
        util.getImageURLs({
          ...post,
          content: {
            ...post.content!,
            entities: {
              links: [
                {
                  link: 'original.png',
                  len: 'original.png'.length,
                  pos: 0,
                  text: 'original.png',
                },
              ],
              mentions: [],
              tags: [],
            },
          },
          raw: [
            {
              type: 'io.pnut.core.oembed',
              value: {
                type: 'photo',
                url: 'original.png',
                thumbnail_url: 'thumbnail.png',
              },
            },
          ],
        })
      ).toMatchObject([
        {
          thumb: 'thumbnail.png',
          original: 'original.png',
        },
      ])
    })
  })
  test('getAudio', () => {
    const post = {
      content: {},
      raw: [
        {
          type: 'io.pnut.core.oembed',
          value: {
            type: 'audio',
            url: 'test.mp3',
            title: 'test',
          },
        },
      ],
    }
    expect(util.getAudio(post)).toMatchObject([
      {
        url: 'test.mp3',
        title: 'test',
      },
    ])
  })
  test('findChatRaw', () => {
    const value = true
    const chatRaw = {
      type: 'io.pnut.core.chat-settings',
      value,
    }
    const channel = {
      ...fixtures<Channel>('channel'),
      raw: [chatRaw],
    }
    expect(util.findChatRaw(channel)).toEqual(chatRaw)
  })

  test('findChatValueRaw', () => {
    const value = true // dummy
    const channel = {
      ...fixtures<Channel>('channel'),
      raw: [
        {
          type: 'io.pnut.core.chat-settings',
          value,
        },
      ],
    }
    expect(util.findChatValueRaw(channel)).toEqual(value)
  })

  test('getVideoSrcFromHtml', () => {
    const youtubeUrl = 'https://www.youtube.com/embed/hoge'
    const filesUrl = 'https://files.pnut.io/foo'
    expect(util.getVideoSrcFromHtml(`<iframe src="${youtubeUrl}" />`)).toEqual(
      youtubeUrl
    )
    expect(util.getVideoSrcFromHtml(`<iframe src="${filesUrl}" />`)).toEqual(
      filesUrl
    )
    expect(util.getVideoSrcFromHtml(`<wrong html />`)).toBeFalsy()
  })

  test('determineVideoType', () => {
    expect(
      util.determineVideoType('https://www.youtube.com/embed/hoge')
    ).toEqual('iframe')
    expect(util.determineVideoType('https://files.pnut.io/foo')).toEqual(
      'video'
    )
  })
})
