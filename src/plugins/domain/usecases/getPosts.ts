import { PnutResponse } from '~/models/pnut-response'
import { Post } from '~/models/post'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { Usecase } from '~/plugins/domain/usecases/usecase'

type StreamType = { type: 'home' } | { type: 'mentions' }

interface Input {
  streamType: StreamType
  params?: GeneralPostParameters
}

interface Output {
  res: PnutResponse<Post[]>
}

export interface getPosts extends Usecase<Input, Promise<Output>> {}

export class getPostsImpl implements getPosts {
  constructor(private readonly pnutRepository: PnutRepository) {}
  async run(input: Input): Promise<Output> {
    // requestMap
    switch (input.streamType.type) {
      case 'home':
        return { res: await this.pnutRepository.getHomeStream(input.params) }
      case 'mentions':
        return { res: await this.pnutRepository.getMentions(input.params) }
    }
    throw new Error('Unsupported streamType')
  }
}
