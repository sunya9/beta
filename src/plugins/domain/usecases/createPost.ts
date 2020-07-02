import { singleton, inject } from 'tsyringe'
import { Post } from '~/models/post'
import { PnutResponse } from '~/models/pnut-response'
import {
  AbstractInput,
  AbstractCreatePostUseCase,
  AbstractCreatePostInteractor,
} from '~/plugins/domain/usecases/abstractCreatePost'
import { CreatePollUseCase } from '~/plugins/domain/usecases/createPoll'
import { CreateFileUseCase } from '~/plugins/domain/usecases/createFile'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

interface Output {
  res: PnutResponse<Post>
}

export type PostBody = Pick<
  AbstractInput,
  'text' | 'replyTo' | 'isNsfw' | 'raw'
>

export interface CreatePostUseCase
  extends AbstractCreatePostUseCase<AbstractInput, Promise<Output>> {}

export namespace CreatePostUseCase {
  export const token = class {}
}

@singleton()
export class CreatePostInteractor
  extends AbstractCreatePostInteractor<AbstractInput, Output>
  implements CreatePostUseCase {
  constructor(
    @inject(PnutRepository.token)
    readonly pnutRepository: PnutRepository,
    @inject(CreateFileUseCase.token)
    readonly createFileUseCase: CreateFileUseCase,
    @inject(CreatePollUseCase.token)
    readonly createPollUseCase: CreatePollUseCase
  ) {
    super(pnutRepository, createFileUseCase, createPollUseCase)
  }

  async post({
    text,
    raw,
    isNsfw: is_nsfw,
    replyTo,
  }: PostBody): Promise<Output> {
    const res = await this.pnutRepository.createPost(
      {
        text,
        raw,
        is_nsfw,
        reply_to: replyTo,
      },
      {
        include_raw: true,
      }
    )
    return {
      res,
    }
  }
}
