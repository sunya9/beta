import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Post } from '~/models/post'
import { PnutResponse } from '~/models/pnut-response'

interface Input {
  postId: string
  text: string
  isNsfw: boolean
}
interface Output {
  res: PnutResponse<Post>
}

export interface UpdatePostUseCase extends Usecase<Input, Promise<Output>> {}

export class UpdatePostInteractor implements UpdatePostUseCase {
  constructor(private readonly pnutRepository: PnutRepository) {}

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
