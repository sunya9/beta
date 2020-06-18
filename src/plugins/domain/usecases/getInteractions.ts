import { Interaction } from '~/models/interaction'
import { PnutResponse } from '~/models/pnut-response'
import { PnutRepository } from '~/plugins/domain/repository/pnutRepository'
import { InteractionType } from '~/plugins/domain/dto/common'
import {
  GetListBaseInput,
  GetListBaseOutput,
  GetListUseCase,
  GetListInteractor,
} from '~/plugins/domain/usecases/getList'
import { GeneralPostParameters } from '~/plugins/domain/dto/post'

interface Input extends GetListBaseInput {
  interactionType?: InteractionType[] | string | Array<string | null>
  params?: GeneralPostParameters
}

interface Output extends GetListBaseOutput<Interaction<any>> {
  filters: { [K in InteractionType]: boolean }
}

export interface GetInteractionsUseCase
  extends GetListUseCase<Interaction<any>, Input, Promise<Output>> {}

export class GetInteractionsInteractor
  extends GetListInteractor<Interaction<any>, Input, Promise<Output>>
  implements GetInteractionsUseCase {
  private getInteractionString(interactionType: Input['interactionType']) {
    return typeof interactionType === 'string'
      ? interactionType
      : interactionType?.join(',') || ''
  }

  getList(input: Input): Promise<PnutResponse<Interaction<any>[]>> {
    const { interactionType } = input
    return this.pnutRepository.getInteractions({
      ...input.params,
      filters: this.getInteractionString(interactionType),
    })
  }

  constructor(private readonly pnutRepository: PnutRepository) {
    super()
  }
}
