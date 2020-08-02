import { singleton, inject } from 'tsyringe'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Post } from '~/entity/post'
import { PnutResponse } from '~/entity/pnut-response'

interface Input {
  postId: string
  text: string
  isNsfw: boolean
}
interface Output {
  res: PnutResponse<Post>
}

export interface UpdatePostUseCase extends UseCase<Input, Promise<Output>> {}

export namespace UpdatePostUseCase {
  export const token = class {}
}

@singleton()
export class UpdatePostInteractor implements UpdatePostUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run({ text, isNsfw: is_nsfw, postId }: Input): Promise<Output> {
    const res = await this.pnutRepository.updatePost(
      postId,
      {
        text,
        is_nsfw,
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
