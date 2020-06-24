import { singleton, inject } from 'tsyringe'
import { Interaction } from '~/models/interaction'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { InteractionType } from '~/plugins/domain/dto/common'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { Usecase } from '~/plugins/domain/usecases/usecase'
import { createListInfo, ListInfo } from '~/plugins/domain/util/util'

interface Input {
  interactionType?: InteractionType[] | string | Array<string | null>
  params?: GeneralPostParameters
}

interface Output {
  listInfo: ListInfo<Interaction>
}

export interface GetInteractionsUseCase
  extends Usecase<Input, Promise<Output>> {}

export namespace GetInteractionsUseCase {
  export const token = class {}
}

@singleton()
export class GetInteractionsInteractor implements GetInteractionsUseCase {
  private getInteractionString(interactionType: Input['interactionType']) {
    return typeof interactionType === 'string'
      ? interactionType
      : interactionType?.join(',') || ''
  }

  constructor(
    @inject(PnutRepository.token)
    private readonly pnutRepository: PnutRepository
  ) {}

  async run(input: Input): Promise<Output> {
    const { interactionType } = input
    const listInfo = await createListInfo(
      (params) =>
        this.pnutRepository.getInteractions({
          ...input.params,
          filters: this.getInteractionString(interactionType),
          ...params,
        }),
      input.params
    )
    return {
      listInfo,
    }
  }
}
