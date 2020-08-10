import { fixtures } from '../../helper'
import * as util from '~/assets/ts/util'
import { Post } from '~/entity/post'
import { Channel } from '~/entity/channel'
import { OEmbed } from '~/entity/raw/raw/oembed'
import { ChatRoomSettings } from '~/entity/raw/raw/chat-room-settings'

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
      const photoRaw: OEmbed.Photo = {
        type: 'io.pnut.core.oembed',
        value: {
          type: 'photo',
          url: 'original.png',
          thumbnail_url: 'thumbnail.png',
          height: 1,
          version: '1.0',
          width: 1,
        },
      }
      expect(
        util.getImageURLs(
          {
            ...fixtures<Post>('post'),
            raw: [photoRaw],
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
      const photoRaw: OEmbed.Photo = {
        type: 'io.pnut.core.oembed',
        value: {
          type: 'photo',
          url: 'original.png',
          thumbnail_url: 'thumbnail.png',
          height: 1,
          version: '1.0',
          width: 1,
        },
      }
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
          raw: [photoRaw],
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
    const audioRaw: OEmbed.Audio = {
      type: 'io.pnut.core.oembed',
      value: {
        type: 'audio',
        url: 'test.mp3',
        title: 'test',
        file_id: '',
        file_token_read: '',
        url_expires_at: new Date(),
        version: '1.0',
      },
    }
    const post: Post = {
      ...fixtures<Post>('post'),
      raw: [audioRaw],
    }
    expect(util.getAudio(post)).toMatchObject([
      {
        url: 'test.mp3',
        title: 'test',
      },
    ])
  })
  test('findChatRaw', () => {
    const chatRaw: ChatRoomSettings = {
      type: 'io.pnut.core.chat-settings',
      value: {
        name: 'test',
      },
    }
    const channel: Channel = {
      ...fixtures<Channel>('channel'),
      raw: [chatRaw],
    }
    expect(ChatRoomSettings.findChatRaw(channel)).toEqual(chatRaw)
  })

  test('findChatValueRaw', () => {
    const chatRaw: ChatRoomSettings = {
      type: 'io.pnut.core.chat-settings',
      value: {
        name: 'test',
      },
    }
    const channel = {
      ...fixtures<Channel>('channel'),
      raw: [chatRaw],
    }
    expect(ChatRoomSettings.findChatValueRaw(channel)).toEqual(chatRaw.value)
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
