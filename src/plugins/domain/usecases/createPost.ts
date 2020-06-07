import { Usecase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Raw } from '~/models/raw'
import { Post } from '~/models/post'
import { PnutResponse } from '~/models/pnut-response'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { LongPost } from '~/models/raw/raw/long-post'
import { createRawList } from '~/util/createRawList'
import { createVideoEmbedRaw } from '~/assets/ts/oembed'
import { CreateFileUseCase } from '~/plugins/domain/usecases/createFile'
import { CreatePollUseCase } from '~/plugins/domain/usecases/createPoll'
import { PollNotice } from '~/models/raw/raw/poll-notice'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'

interface Input {
  text: string
  isNsfw: boolean
  reply?: Post | null
  files: File[]
  spoiler: Spoiler.Value | null
  longpost: LongPost.Value | null
  pollRequest: CreatePollRequest | null
}
interface Output {
  res: PnutResponse<Post>
}

export interface CreatePostUseCase extends Usecase<Input, Promise<Output>> {}

export class CreatePostInteractor implements CreatePostUseCase {
  constructor(
    private readonly pnutRepository: PnutRepository,
    private readonly createFileUseCase: CreateFileUseCase,
    private readonly createPollUseCase: CreatePollUseCase
  ) {}

  async run({
    text,
    isNsfw: is_nsfw,
    reply,
    spoiler,
    longpost,
    files,
    pollRequest,
  }: Input): Promise<Output> {
    const createFilePromise = this.createFileUseCase.run({
      files,
    })
    const createPollPromise = pollRequest
      ? this.createPollUseCase.run({
          poll: pollRequest,
          fallbackText: text,
        })
      : Promise.resolve(null)
    const [createFileResult, createPollResult] = await Promise.all([
      createFilePromise,
      createPollPromise,
    ])
    const fileRawList = createFileResult?.fileRawList ?? []
    const raw: Raw<any>[] = createRawList(
      Spoiler.createSpoilerRaw(spoiler),
      LongPost.createLongpostRaw(longpost),
      ...createVideoEmbedRaw(text),
      ...fileRawList,
      PollNotice.createPollNoticeReplecementRaw(createPollResult?.poll)
    )

    const res = await this.pnutRepository.createPost(
      {
        text,
        raw,
        is_nsfw,
        reply_to: reply?.id,
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
