import { injectable, inject } from 'tsyringe'
import { PnutResponse } from '~/models/pnut-response'
import { Marker } from '~/models/marker'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'

export type Input = (
  | {
      type: 'global' | 'personal' | 'mentions'
    }
  | {
      type: 'channel'
      channelId: string
    }
) & {
  id: string
}

interface Output {
  res: PnutResponse<Marker>
}

export interface MarkAsReadUseCase extends UseCase<Input, Promise<Output>> {}

export namespace MarkAsReadUseCase {
  export const token = class {}
}

function getName(input: Input) {
  if (input.type === 'channel') return `channel:${input.channelId}`
  return input.type
}

@injectable()
export class MarkAsReadInteractor implements MarkAsReadUseCase {
  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const name = getName(input)
    const res = await this.pnutRepository.postMarker([
      {
        name,
        id: input.id,
      },
    ])
    return {
      res,
    }
  }
}
