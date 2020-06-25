import { OEmbed } from '~/models/raw/raw/oembed'

const youtube = {
  regexp: /https?:\/\/(?:(?:www)?\.youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9\-_]+)/g,
  html: (id: string) =>
    `<iframe src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`,

  // { provider_name: String, provider_url: String, regex: RegExp, html: function(id) }
}

const detectGenerators = [youtube]

type ResObj = { html: string; embeddable_url: string }
export function createVideoEmbedRaw(text: string): OEmbed.Video[] {
  return detectGenerators
    .reduce<ResObj[]>((rawHtmls, detectGenerator) => {
      let matcher
      while ((matcher = detectGenerator.regexp.exec(text)) !== null) {
        const [embeddable_url, id] = matcher
        rawHtmls.push({
          html: detectGenerator.html(id),
          embeddable_url,
        })
      }
      return rawHtmls
    }, [])
    .map<OEmbed.Video>((resObj) => {
      const { html, embeddable_url } = resObj
      return {
        type: 'io.pnut.core.oembed',
        value: {
          version: '1.0',
          type: 'video',
          width: 480,
          height: 270,
          html,
          embeddable_url,
        },
      }
    })
}
