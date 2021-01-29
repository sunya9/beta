import { createVideoEmbedRaw } from '~/assets/ts/oembed'
import { OEmbed } from '~/entity/raw/raw/oembed'

describe('oembed', () => {
  test('createVideoEmbedRaw', () => {
    const res = createVideoEmbedRaw(
      'lorem https://www.youtube.com/watch?v=exam-ple_ http://youtu.be/123exXmp-le_ ipsum'
    )
    const el0: OEmbed.Video = {
      type: 'io.pnut.core.oembed',
      value: {
        version: '1.0',
        type: 'video',
        width: 480,
        height: 270,
        html:
          '<iframe src="https://www.youtube.com/embed/exam-ple_" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        embeddable_url: 'https://www.youtube.com/watch?v=exam-ple_',
      },
    }
    expect(res[0]).toStrictEqual(el0)

    const el1: OEmbed.Video = {
      type: 'io.pnut.core.oembed',
      value: {
        version: '1.0',
        type: 'video',
        width: 480,
        height: 270,
        html:
          '<iframe src="https://www.youtube.com/embed/123exXmp-le_" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
        embeddable_url: 'http://youtu.be/123exXmp-le_',
      },
    }
    expect(res[1]).toStrictEqual(el1)

    expect(createVideoEmbedRaw('embeddable contents not found')).toStrictEqual(
      []
    )
  })
})
