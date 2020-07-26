import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { Raw } from '~/models/raw'
import { Spoiler } from '~/models/raw/raw/spoiler'
import { LongPost } from '~/models/raw/raw/long-post'
import { createRawList } from '~/util/createRawList'
import { createVideoEmbedRaw } from '~/assets/ts/oembed'
import { CreateFileUseCase } from '~/plugins/domain/usecases/createFile'
import { CreatePollUseCase } from '~/plugins/domain/usecases/createPoll'
import { PollNotice } from '~/models/raw/raw/poll-notice'
import { CreatePollRequest } from '~/plugins/domain/dto/poll'

export interface AbstractInput {
  text: string
  isNsfw: boolean
  replyTo?: string
  files: File[]
  spoiler: Spoiler.Value | null
  longpost: LongPost.Value | null
  pollRequest: CreatePollRequest | null
  raw?: Raw[]
  passRawHandling?: boolean
}

export interface AbstractCreatePostUseCase<Input, Output>
  extends UseCase<Input, Output> {}

export abstract class AbstractCreatePostInteractor<
  Input extends AbstractInput,
  Output
> implements AbstractCreatePostUseCase<Input, Promise<Output>> {
  constructor(
    protected readonly pnutRepository: PnutRepository,
    readonly createFileUseCase: CreateFileUseCase,
    readonly createPollUseCase: CreatePollUseCase
  ) {}

  async run(input: Input): Promise<Output> {
    const additionalRaw: Raw[] = !input.passRawHandling
      ? await this.handleRaw(input)
      : input.raw || []
    const res = this.post({
      ...input,
      raw: additionalRaw,
    })
    return res
  }

  async handleRaw(input: Input): Promise<Raw[]> {
    const { text, spoiler, longpost, files, pollRequest, raw: inputRaw } = input

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
    const raw: Raw[] = createRawList(
      Spoiler.createSpoilerRaw(spoiler),
      LongPost.createLongpostRaw(longpost),
      ...createVideoEmbedRaw(text),
      ...fileRawList,
      PollNotice.createPollNoticeReplecementRaw(createPollResult?.poll)
    )
    return raw.concat(inputRaw || [])
  }

  abstract post(input: Input & { raw: Raw[] }): Promise<Output>
}
