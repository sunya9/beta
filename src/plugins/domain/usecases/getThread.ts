import { ListInfo, createListInfo } from '~/plugins/domain/util/util'
import { Post } from '~/models/post'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { Pagination } from '~/plugins/domain/dto/common'
import { getImageURLs } from '~/assets/ts/util'

interface Input {
  postId: string
  params?: GeneralPostParameters & Pagination
}

interface Output {
  title?: string
  listInfo: ListInfo<Post>
  meta?: any[] // TODO?
}

function getHtmlMeta(post?: Post) {
  if (!post || !post.user || !post.content) return
  const name = post.user.name
    ? `${post.user.name}(@${post.user.username})`
    : `@${post.user?.username}`
  const fullTitle = `${name}: ${post.content?.text}`
  const title =
    fullTitle.length > 50 ? `${fullTitle.substr(0, 50)}…` : fullTitle
  const meta = [
    { hid: 'description', name: 'description', content: fullTitle },
    {
      hid: 'og:description',
      property: 'og:description',
      content: fullTitle,
    },
    { hid: 'og:title', property: 'og:title', content: title },
  ]
  const [photo] = getImageURLs(post, true)
  if (photo) {
    meta.push(
      {
        hid: 'og:image',
        property: 'og:image',
        content: photo.original,
      },
      {
        hid: 'og:image:width',
        property: 'og:image:width',
        content: photo.width.toString(),
      },
      {
        hid: 'og:image:height',
        property: 'og:image:height',
        content: photo.height.toString(),
      },
      {
        hid: 'og:type',
        property: 'og:type',
        content: 'article',
      },
      {
        hid: 'article:published_time',
        property: 'article:published_time',
        content: post.created_at.toString(),
      },
      {
        hid: 'article:author',
        property: 'article:author',
        content: post.user?.username || '',
      }
    )
  }
  return {
    title,
    meta,
  }
}

export interface GetThreadUseCase extends Usecase<Input, Promise<Output>> {}

export class GetThreadInteractor implements GetThreadUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    const listInfo = await createListInfo(
      (config) =>
        this.pnutRepository.getThread(input.postId, {
          ...input.params,
          ...config,
        }),
      input.params
    )
    const data = listInfo.data
    const id = input.postId
    const post = data.find((post) => post.id === id)
    const metas = getHtmlMeta(post)
    return {
      listInfo,
      title: metas?.title,
      meta: metas?.meta,
    }
  }
}
