import * as util from '~/assets/js/util'

describe('util', () => {
  test('getRSSLink', () => {
    expect(util.getRSSLink('foo')).toEqual({
      hid: 'rss',
      rel: 'alternate',
      type: 'application/rss+xml',
      href: 'foo'
    })
  })
  describe('getImageURLs', () => {
    it('get from link', () => {
      expect(
        util.getImageURLs({
          content: {
            entities: {
              links: [
                {
                  link: 'photo.jpeg'
                }
              ]
            }
          }
        })
      ).toEqual([
        {
          thumb: 'photo.jpeg',
          original: 'photo.jpeg'
        }
      ])
    })
    it('get from raw', () => {
      expect(
        util.getImageURLs(
          {
            content: {},
            raw: [
              {
                type: 'io.pnut.core.oembed',
                value: {
                  type: 'photo',
                  url: 'original.png',
                  thumbnail_url: 'thumbnail.png'
                }
              }
            ]
          },
          true
        )
      ).toMatchObject([
        {
          thumb: 'thumbnail.png',
          original: 'original.png'
        }
      ])
    })
    it('Remove duplicate', () => {
      expect(
        util.getImageURLs({
          content: {
            entities: {
              links: [
                {
                  link: 'original.png'
                }
              ]
            }
          },
          raw: [
            {
              type: 'io.pnut.core.oembed',
              value: {
                type: 'photo',
                url: 'original.png',
                thumbnail_url: 'thumbnail.png'
              }
            }
          ]
        })
      ).toMatchObject([
        {
          thumb: 'thumbnail.png',
          original: 'original.png'
        }
      ])
    })
  })
})
