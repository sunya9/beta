import { singleton, inject } from 'tsyringe'
import { InteractionType, Interaction } from '~/entity/interaction'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'
import { UseCase } from '~/plugins/domain/usecases/usecase'
import { createListInfo, ListInfo } from '~/plugins/domain/util/util'

interface Input {
  interactionType?: Interaction.ActionType[] | string | Array<string | null>
  params?: GeneralPostParameters
}

interface Output {
  listInfo: ListInfo<InteractionType>
}

export interface GetInteractionsUseCase
  extends UseCase<Input, Promise<Output>> {}

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
    const listInfo = await createListInfo((pagination) =>
      this.pnutRepository.getInteractions({
        ...input.params,
        filters: this.getInteractionString(interactionType),
        ...pagination,
      })
    )
    return {
      listInfo,
    }
  }
}
